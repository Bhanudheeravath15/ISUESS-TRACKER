import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="padding:16px">
      <h1>Issue Tracker</h1>
      <app-issue-list></app-issue-list>
    </div>
  `
})
export class AppComponent {}
