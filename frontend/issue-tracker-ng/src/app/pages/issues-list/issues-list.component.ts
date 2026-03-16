import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssuesService, Issue, Status, Priority } from '../../services/issues.service';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  rows: Issue[] = [];

  // filters
  search = '';
  status: '' | Status = '';
  priority: '' | Priority = '';
  assignee = '';

  // sort & pagination (basic, client-side placeholders)
  sortBy: keyof Issue = 'updatedAt';
  sortOrder: 'asc'|'desc' = 'desc';
  page = 1;
  pageSize = 10;

  constructor(private api: IssuesService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load() {
    const s: Status | undefined = this.status === '' ? undefined : this.status;
    const p: Priority | undefined = this.priority === '' ? undefined : this.priority;

    this.api.list({
      search: this.search || undefined,
      status: s,
      priority: p,
      assignee: this.assignee || undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      page: this.page,
      pageSize: this.pageSize
    }).subscribe(data => this.rows = data);
  }

  openDetail(row: Issue) {
    this.router.navigate(['/issues', row.id]);
  }
}
