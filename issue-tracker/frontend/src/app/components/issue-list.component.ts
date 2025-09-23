import { Component, OnInit } from '@angular/core';
import { IssueService } from '../services/issue.service';

@Component({
  selector: 'app-issue-list',
  template: `
  <div>
    <div style="margin-bottom:8px">
      <input [(ngModel)]="q" placeholder="Search title..." />
      <select [(ngModel)]="status">
        <option value="">All Status</option>
        <option>Open</option>
        <option>In Progress</option>
        <option>Closed</option>
      </select>
      <select [(ngModel)]="priority">
        <option value="">All Priority</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input [(ngModel)]="assignee" placeholder="Assignee" />
      <button (click)="load()">Search</button>
      <button (click)="openCreate()">Create Issue</button>
    </div>

    <table border="1" width="100%" style="border-collapse:collapse">
      <thead>
        <tr>
          <th (click)="sort('id')">ID</th>
          <th (click)="sort('title')">Title</th>
          <th (click)="sort('status')">Status</th>
          <th (click)="sort('priority')">Priority</th>
          <th (click)="sort('assignee')">Assignee</th>
          <th (click)="sort('updatedAt')">Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let it of items" (click)="openDetail(it)" style="cursor:pointer">
          <td>{{it.id}}</td>
          <td>{{it.title}}</td>
          <td>{{it.status}}</td>
          <td>{{it.priority}}</td>
          <td>{{it.assignee}}</td>
          <td>{{it.updatedAt}}</td>
          <td><button (click)="edit(it, $event)">Edit</button></td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:8px">
      <button (click)="prev()" [disabled]="page<=1">Prev</button>
      Page {{page}} / {{totalPages}}
      <button (click)="next()" [disabled]="page>=totalPages">Next</button>
    </div>

    <div *ngIf="showForm" style="border:1px solid #ccc; padding:8px; margin-top:8px">
      <h3>{{editing ? 'Edit' : 'Create'}} Issue</h3>
      <label>Title</label><br/>
      <input [(ngModel)]="form.title" /><br/>
      <label>Description</label><br/>
      <textarea [(ngModel)]="form.description"></textarea><br/>
      <label>Status</label><br/>
      <select [(ngModel)]="form.status">
        <option>Open</option><option>In Progress</option><option>Closed</option>
      </select><br/>
      <label>Priority</label><br/>
      <select [(ngModel)]="form.priority">
        <option>Low</option><option>Medium</option><option>High</option>
      </select><br/>
      <label>Assignee</label><br/>
      <input [(ngModel)]="form.assignee" /><br/>
      <button (click)="submit()">{{editing ? 'Save' : 'Create'}}</button>
      <button (click)="cancel()">Cancel</button>
    </div>

    <app-issue-detail *ngIf="detailVisible" [issueId]="selectedId" (close)="detailVisible=false"></app-issue-detail>
  </div>
  `
})
export class IssueListComponent implements OnInit {
  items: any[] = [];
  page = 1;
  pageSize = 10;
  total = 0;
  totalPages = 1;
  q = '';
  status = '';
  priority = '';
  assignee = '';
  sortBy = 'updatedAt';
  sortDir = 'desc';

  showForm = false;
  editing = false;
  form: any = {};
  selectedId: string | null = null;
  detailVisible = false;

  constructor(private svc: IssueService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.list(this.page, this.pageSize, this.q, this.status, this.priority, this.assignee, this.sortBy, this.sortDir)
      .subscribe((r:any) => {
        this.items = r.items;
        this.total = r.total;
        this.totalPages = Math.max(1, Math.ceil(this.total / this.pageSize));
      });
  }

  sort(field: string) {
    if (this.sortBy === field) this.sortDir = this.sortDir === 'desc' ? 'asc' : 'desc';
    else { this.sortBy = field; this.sortDir = 'desc'; }
    this.load();
  }

  prev() { this.page--; this.load(); }
  next() { this.page++; this.load(); }

  openCreate() {
    this.editing = false;
    this.form = {title:'', description:'', status:'Open', priority:'Medium', assignee:''};
    this.showForm = true;
  }

  edit(item: any, ev: Event) {
    ev.stopPropagation();
    this.editing = true;
    this.form = {...item};
    this.showForm = true;
  }

  submit() {
    if (this.editing) {
      this.svc.update(this.form.id, this.form).subscribe(()=>{ this.showForm=false; this.load(); });
    } else {
      this.svc.create(this.form).subscribe(()=>{ this.showForm=false; this.page=1; this.load(); });
    }
  }

  cancel() { this.showForm=false; }

  openDetail(item:any) {
    this.selectedId = item.id;
    this.detailVisible = true;
  }
}
