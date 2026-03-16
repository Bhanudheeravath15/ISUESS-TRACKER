import { Routes, withHashLocation } from '@angular/router';
import { provideRouter } from '@angular/router';
import { IssuesListComponent } from './pages/issues-list/issues-list.component';
import { IssueDetailComponent } from './pages/issue-detail/issue-detail.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'issues' },
  { path: 'issues', component: IssuesListComponent },
  { path: 'issues/:id', component: IssueDetailComponent },
];

// Export a provider you’ll use in main.ts
export const appRouterProviders = [
  provideRouter(routes, withHashLocation())
];