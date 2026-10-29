import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubjectItem } from '../../../subjects.presenter';
import { SubjectsSaveFormPayload } from '../models/interfaces/subjects-save-form-payload.interface';
import { SubjectsSaveDialogFormModel } from './models/subjects-save-dialog-form.model';
import { SUBJECTS_SAVE_DIALOG_FORM_MODEL_CONSTANT } from './models/subjects-save-dialog-form.model.constant';
import { SubjectsSaveDialogFormModelInterface } from './models/subjects-save-dialog-form.model.interface';
import { FormControlError } from '../../../../../../shared/class/form-model';

@Injectable()
export class SubjectsSaveDialogFormPresenter {
  private readonly fb = inject(FormBuilder);

  public readonly formModel = new SubjectsSaveDialogFormModel();
  public readonly formConstant = SUBJECTS_SAVE_DIALOG_FORM_MODEL_CONSTANT;
  public readonly form: FormGroup = this.fb.group(new SubjectsSaveDialogFormModel());

  public preloadData(data: SubjectItem): void {
    this.form.patchValue({
      name: data.name,
      area: data.areaId || data.area,
      weeklyHours: data.hours,
      description: data.description ?? '',
    });
  }

  public resetForm(): void {
    this.form.reset({
      name: '',
      area: '',
      weeklyHours: 2,
      description: '',
    });
  }

  public getErrorMessage(control: string): FormControlError {
    return this.formModel.getErrorMessage(control, this.form);
  }

  public getPayload(): SubjectsSaveFormPayload {
    const value = this.form.getRawValue() as SubjectsSaveDialogFormModelInterface;
    return {
      name: value.name?.trim() ?? '',
      area: value.area ?? '',
      weeklyHours: Number(value.weeklyHours ?? 2),
      description: value.description?.trim() || undefined,
    };
  }

  public markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }
}