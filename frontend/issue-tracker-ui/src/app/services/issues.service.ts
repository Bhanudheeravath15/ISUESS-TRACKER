import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Status = 'open'|'in_progress'|'resolved'|'closed';
export type Priority = 'low'|'medium'|'high'|'critical';

export interface Issue {
  id: number;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}
export interface IssueCreate {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  assignee?: string;
}
export interface IssueUpdate extends Partial<IssueCreate> {}

@Injectable({ providedIn: 'root' })
export class IssuesService {
  private baseUrl = '/api';
  constructor(private http: HttpClient) {}

  list(params: {
    search?: string; status?: Status; priority?: Priority; assignee?: string;
    sortBy?: string; sortOrder?: 'asc'|'desc'; page?: number; pageSize?: number;
  }): Observable<Issue[]> {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') hp = hp.set(k, String(v));
    });
    return this.http.get<Issue[]>(`${this.baseUrl}/issues`, { params: hp });
  }

  get(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.baseUrl}/issues/${id}`);
  }

  create(payload: IssueCreate): Observable<Issue> {
    return this.http.post<Issue>(`${this.baseUrl}/issues`, payload);
  }

  update(id: number, payload: IssueUpdate): Observable<Issue> {
    return this.http.put<Issue>(`${this.baseUrl}/issues/${id}`, payload);
  }
}
