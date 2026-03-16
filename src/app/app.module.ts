import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';
import { IssuesListComponent } from './pages/issues-list/issues-list.component';
import { IssueDetailComponent } from './pages/issue-detail/issue-detail.component';
import { IssueFormComponent } from './components/issue-form/issue-form.component';

@NgModule({
  declarations: [
    AppComponent,
    IssuesListComponent,
    IssueDetailComponent,
    IssueFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
