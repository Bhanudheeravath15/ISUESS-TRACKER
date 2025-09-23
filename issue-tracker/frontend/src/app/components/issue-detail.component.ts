import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { IssueService } from '../services/issue.service';

@Component({
  selector: 'app-issue-detail',
  template: `
    <div style="position:fixed; right:0; top:0; width:40%; height:100%; background:#fff; border-left:1px solid #ccc; padding:16px; overflow:auto">
      <button (click)="close.emit()">Close</button>
      <h3>Issue Detail</h3>
      <pre *ngIf="issue">{{ issue | json }}</pre>
      <div *ngIf="!issue">Loading...</div>
    </div>
  `
})
export class IssueDetailComponent implements OnChanges {
  @Input() issueId: string | null = null;
  @Output() close = new EventEmitter<void>();
  issue: any = null;

  constructor(private svc: IssueService) {}

  ngOnChanges() {
    if (this.issueId) {
      this.svc.get(this.issueId).subscribe(r => this.issue = r);
    }
  }
}
