import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilterOption } from '../../../components/subjects-filters/models/interfaces/filter-option.interface';
import { SubjectItem } from '../../../subjects.presenter';
import { SubjectsSaveFormPayload } from '../models/interfaces/subjects-save-form-payload.interface';
import { SubjectsSaveDialogFormPresenter } from './subjects-save-dialog-form.presenter';

@Component({
  selector: 'app-subjects-save-dialog-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [SubjectsSaveDialogFormPresenter],
  templateUrl: './subjects-save-dialog-form.component.html',
  styleUrl: './subjects-save-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsSaveDialogFormComponent {
  public readonly presenter = inject(SubjectsSaveDialogFormPresenter);

  public readonly mode = input<'create' | 'edit'>('create');
  public readonly initialData = input<SubjectItem | null | undefined>(null);
  public readonly areas = input.required<readonly FilterOption[]>();
  public readonly isSaving = input<boolean>(false);

  public readonly formSubmit = output<SubjectsSaveFormPayload>();
  public readonly formCancel = output<void>();

  public readonly selectableAreas = computed(() =>
    this.areas().filter(option => option.value !== 'ALL')
  );

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.presenter.preloadData(data);
      } else {
        this.presenter.resetForm();
      }
    });
  }

  public onSubmit(): void {
    if (this.presenter.form.invalid) {
      this.presenter.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.presenter.getPayload());
  }

  public onCancel(): void {
    this.formCancel.emit();
  }
}