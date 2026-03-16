from datetime import datetime
from typing import Optional, List
from enum import Enum

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select


# ---- Enums ----
class StatusEnum(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


# ---- Models ----
class IssueBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: StatusEnum = Field(default=StatusEnum.open)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)
    assignee: Optional[str] = None


class Issue(IssueBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class IssueCreate(IssueBase):
    pass


class IssueUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[StatusEnum] = None
    priority: Optional[PriorityEnum] = None
    assignee: Optional[str] = None


# ---- App & DB ----
app = FastAPI(title="Issue Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev-friendly; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("sqlite:///./issues.db", echo=False)

def init_db():
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    init_db()


# ---- Health ----
@app.get("/health")
def health():
    return {"status": "ok"}


# ---- Endpoints ----
@app.get("/issues", response_model=List[Issue])
def list_issues(
    search: Optional[str] = Query(default=None, description="search by title"),
    status: Optional[StatusEnum] = None,
    priority: Optional[PriorityEnum] = None,
    assignee: Optional[str] = None,
    sortBy: Optional[str] = "updatedAt",
    sortOrder: Optional[str] = "desc",
    page: int = 1,
    pageSize: int = 10,
):
    # sanity guards
    page = max(1, page)
    pageSize = max(1, min(100, pageSize))
    allowed_sort = {"id", "title", "status", "priority", "assignee", "updatedAt"}
    if sortBy not in allowed_sort:
        sortBy = "updatedAt"
    sortOrder = "asc" if str(sortOrder).lower() == "asc" else "desc"

    with Session(engine) as session:
        stmt = select(Issue)

        if search:
            stmt = stmt.where(Issue.title.ilike(f"%{search}%"))
        if status:
            stmt = stmt.where(Issue.status == status)
        if priority:
            stmt = stmt.where(Issue.priority == priority)
        if assignee:
            stmt = stmt.where(Issue.assignee.ilike(f"%{assignee}%"))

        # sorting
        sort_column = getattr(Issue, sortBy)
        if sortOrder == "desc":
            sort_column = sort_column.desc()
        stmt = stmt.order_by(sort_column)

        # pagination
        offset = (page - 1) * pageSize
        stmt = stmt.offset(offset).limit(pageSize)

        return session.exec(stmt).all()


@app.get("/issues/{issue_id}", response_model=Issue)
def get_issue(issue_id: int):
    with Session(engine) as session:
        issue = session.get(Issue, issue_id)
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        return issue


@app.post("/issues", response_model=Issue, status_code=201)
def create_issue(payload: IssueCreate):
    now = datetime.utcnow()
    issue = Issue(**payload.dict(), createdAt=now, updatedAt=now)
    with Session(engine) as session:
        session.add(issue)
        session.commit()
        session.refresh(issue)
        return issue


@app.put("/issues/{issue_id}", response_model=Issue)
def update_issue(issue_id: int, payload: IssueUpdate):
    with Session(engine) as session:
        issue = session.get(Issue, issue_id)
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")

        data = payload.dict(exclude_unset=True)
        for k, v in data.items():
            setattr(issue, k, v)
        issue.updatedAt = datetime.utcnow()

        session.add(issue)
        session.commit()
        session.refresh(issue)
        return issue


# Optional: delete support (useful while testing)
@app.delete("/issues/{issue_id}", status_code=204)
def delete_issue(issue_id: int):
    with Session(engine) as session:
        issue = session.get(Issue, issue_id)
        if not issue:
            raise HTTPException(status_code=404, detail="Issue not found")
        session.delete(issue)
        session.commit()
    return None


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
