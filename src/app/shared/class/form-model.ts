import { FormGroup } from '@angular/forms';
import { ErrorMessage } from '../../core/constants/form-error-message.constants';

export interface FormControlError {
  state: 'error' | '';
  error: string;
}

export class FormModel {
  public getErrorMessage(control: string, form: FormGroup): FormControlError {
    const controlRef = form.get(control);
    if (!controlRef) {
      throw new Error(`El control '${control}' no existe en el FormGroup.`);
    }

    const { touched, dirty, errors } = controlRef;
    const message: FormControlError = { state: '', error: '' };

    if ((!touched && !dirty) || !errors) {
      return message;
    }

    const typeError = Object.keys(errors)[0];
    if (typeError) {
      message.error = ErrorMessage[String(typeError)] ?? 'Error de validación.';
      message.state = 'error';
    }

    return message;
  }
}
