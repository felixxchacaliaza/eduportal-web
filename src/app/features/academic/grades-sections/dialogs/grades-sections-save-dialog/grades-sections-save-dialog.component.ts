import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GradesSectionsSaveDialogPresenter } from './grades-sections-save-dialog.presenter';

@Component({
  selector: 'app-grades-sections-save-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  providers: [GradesSectionsSaveDialogPresenter],
  templateUrl: './grades-sections-save-dialog.component.html',
  styleUrl: './grades-sections-save-dialog.component.scss',
})
export class GradesSectionsSaveDialogComponent implements OnInit {
  public readonly presenter = inject(GradesSectionsSaveDialogPresenter);
  private readonly fb = inject(FormBuilder);

  public readonly form: FormGroup = this.fb.group({
    grade: [this.presenter.data.gradeSection?.gradeId || '', [Validators.required]],
    section: [this.presenter.data.gradeSection?.sectionId || '', [Validators.required]],
    classroom: [this.presenter.data.gradeSection?.classroomId || '', [Validators.required]],
    shift: [this.presenter.data.gradeSection?.shift || 'MAÑANA', [Validators.required]],
    maxCapacity: [{ value: this.presenter.data.gradeSection?.maxCapacity || 30, disabled: false }, [Validators.required, Validators.min(1)]],
  });

  public ngOnInit(): void {
    this.form.get('shift')?.valueChanges.subscribe((shift: string) => {
      this.presenter.setShift(shift);
      const currentClassroomId = this.form.get('classroom')?.value;
      if (currentClassroomId) {
        const isStillAvailable = this.presenter.availableClassrooms().some(c => (c.id || (c as any)._id) === currentClassroomId);
        if (!isStillAvailable) {
          this.form.get('classroom')?.setValue('');
          this.form.get('maxCapacity')?.setValue(0);
        }
      }
    });

    this.form.get('classroom')?.valueChanges.subscribe((classroomId: string) => {
      if (classroomId) {
        const selected = this.presenter.rawClassrooms().find(c => (c.id || (c as any)._id) === classroomId);
        if (selected) {
          this.form.get('maxCapacity')?.setValue(selected.capacity);
        }
      } else {
        this.form.get('maxCapacity')?.setValue(0);
      }
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.presenter.save(this.form.getRawValue());
  }
}