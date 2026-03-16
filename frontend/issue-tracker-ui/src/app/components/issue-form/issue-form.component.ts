import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { IssuesService, Issue, IssueCreate } from '../../services/issues.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-issue-form',
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss']
})
export class IssueFormComponent {
  isEdit = false;
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Issue | null,
    private ref: MatDialogRef<IssueFormComponent>,
    private fb: FormBuilder,
    private api: IssuesService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['open'],
      priority: ['medium'],
      assignee: [''],
    });

    if (data) {
      this.isEdit = true;
      this.form.patchValue({
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        assignee: data.assignee || ''
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const payload = this.form.value as IssueCreate;
    if (this.isEdit && this.data) this.api.update(this.data.id, payload).subscribe(() => this.ref.close(true));
    else this.api.create(payload).subscribe(() => this.ref.close(true));
  }

  cancel() { this.ref.close(false); }
}