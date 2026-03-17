import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/* ======================
   TYPES (FIXES BUILD)
   ====================== */

export type Status = 'open' | 'in_progress' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

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

/* ======================
   SERVICE
   ====================== */

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(params: {
    search?: string;
    status?: Status;
    priority?: Priority;
    assignee?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }) {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        hp = hp.set(k, String(v));
      }
    });
    return this.http.get<Issue[]>(`${this.baseUrl}/issues`, { params: hp });
  }

  get(id: number) {
    return this.http.get<Issue>(`${this.baseUrl}/issues/${id}`);
  }

  create(payload: IssueCreate) {
    return this.http.post<Issue>(`${this.baseUrl}/issues`, payload);
  }

  update(id: number, payload: IssueCreate) {
    return this.http.put<Issue>(`${this.baseUrl}/issues/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/issues/${id}`);
  }
}