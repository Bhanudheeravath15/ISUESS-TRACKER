import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IssuesService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  list(params: any) {
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        hp = hp.set(k, String(v));
      }
    });
    return this.http.get<any>(`${this.baseUrl}/issues`, { params: hp });
  }

  get(id: number) {
    return this.http.get(`${this.baseUrl}/issues/${id}`);
  }

  create(payload: any) {
    return this.http.post(`${this.baseUrl}/issues`, payload);
  }

  update(id: number, payload: any) {
    return this.http.put(`${this.baseUrl}/issues/${id}`, payload);
  }
}
