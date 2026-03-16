import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IssuesService, Issue, Status, Priority } from '../../services/issues.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { IssueFormComponent } from '../../components/issue-form/issue-form.component';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  rows: Issue[] = [];
  cols = ['id','title','status','priority','assignee','updatedAt','actions'];

  status: '' | Status = '';
  priority: '' | Priority = '';
  search = '';
  assignee = '';

  sortBy = 'updatedAt';
  sortOrder: 'asc'|'desc' = 'desc';
  page = 1;
  pageSize = 10;
  total = 1000; // placeholder until backend returns total

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: IssuesService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void { this.load(); }

  load() {
    const statusParam: Status | undefined = this.status === '' ? undefined : this.status;
    const priorityParam: Priority | undefined = this.priority === '' ? undefined : this.priority;

    this.api.list({
      search: this.search || undefined,
      status: statusParam,
      priority: priorityParam,
      assignee: this.assignee || undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.page,
      pageSize: this.pageSize,
    }).subscribe((data: Issue[]) => {
      this.rows = data;
    });
  }

  onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }
  onSort(e: Sort) { if (e.active) { this.sortBy = e.active; this.sortOrder = e.direction === 'asc' ? 'asc' : 'desc'; this.load(); } }
  openCreate() { const ref = this.dialog.open(IssueFormComponent, { width: '520px', data: null }); ref.afterClosed().subscribe(ok => ok && this.load()); }
  openEdit(row: Issue) { const ref = this.dialog.open(IssueFormComponent, { width: '520px', data: row }); ref.afterClosed().subscribe(ok => ok && this.load()); }
  openDetail(row: Issue) { this.router.navigate(['/issues', row.id]); }
}