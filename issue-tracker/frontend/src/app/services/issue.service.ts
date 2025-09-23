import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class IssueService {
  base = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  list(page=1, pageSize=10, q='', status='', priority='', assignee='', sortBy='updatedAt', sortDir='desc') {
    let params: any = {page: page.toString(), pageSize: pageSize.toString(), sortBy, sortDir};
    if (q) params.q = q;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (assignee) params.assignee = assignee;
    return this.http.get<any>(this.base + '/issues', {params});
  }

  get(id: string) {
    return this.http.get<any>(this.base + '/issues/' + id);
  }

  create(payload: any) {
    return this.http.post<any>(this.base + '/issues', payload);
  }

  update(id: string, payload: any) {
    return this.http.put<any>(this.base + '/issues/' + id, payload);
  }
}
