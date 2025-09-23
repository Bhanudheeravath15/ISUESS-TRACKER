import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IssueListComponent } from './components/issue-list.component';
import { IssueDetailComponent } from './components/issue-detail.component';

@NgModule({
  declarations: [AppComponent, IssueListComponent, IssueDetailComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
