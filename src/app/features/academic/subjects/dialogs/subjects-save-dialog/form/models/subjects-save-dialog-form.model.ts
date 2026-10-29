import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../../shared/class/form-model';

export class SubjectsSaveDialogFormModel extends FormModel {
  name = ['', [Validators.required, Validators.minLength(3)]];
  area = ['', [Validators.required]];
  weeklyHours = [2, [Validators.required, Validators.min(1), Validators.max(20)]];
  description = [''];
}