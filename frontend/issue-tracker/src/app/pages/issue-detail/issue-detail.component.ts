import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssuesService, Issue } from '../../services/issues.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  issue?: Issue;
  loading = true;

  constructor(private route: ActivatedRoute, private api: IssuesService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.get(id).subscribe((res: Issue) => {
      this.issue = res;
      this.loading = false;
    });
  }
}