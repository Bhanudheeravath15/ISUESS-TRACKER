# Simple Issue Tracker

This project is a small Issue Tracker with a Python (FastAPI) backend and an Angular frontend.

## Backend (FastAPI)
Run steps:
1. `cd backend`
2. Create a virtualenv and install: `pip install -r requirements.txt`
3. `uvicorn main:app --reload --port 8000`
API endpoints:
- GET /health
- GET /issues (supports q, status, priority, assignee, page, pageSize, sortBy, sortDir)
- GET /issues/{id}
- POST /issues
- PUT /issues/{id}

A simple `issues.json` is used for persistence.

## Frontend (Angular) - minimal skeleton
This repo contains a minimal Angular app under `frontend/src`. To run:
1. Install Node.js and Angular CLI.
2. `cd frontend`
3. `npm install`
4. `ng serve`

The frontend expects the backend at `http://localhost:8000`.

## Notes
- This is a minimal implementation intended for the assignment: view, search, filter, sort, paginate, create and update issues.
- The Angular app is a lightweight skeleton with essential components. You can expand styles, routing, and error handling as needed.

Submission deadline mentioned: 25 September 2025.