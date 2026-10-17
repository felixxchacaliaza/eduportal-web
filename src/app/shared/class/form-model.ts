import { FormGroup } from '@angular/forms';
import { ErrorMessage } from '../../core/constants/form-error-message.constants';

/**
 * ============================================================================
 * FormControlError Interface
 * ============================================================================
 * Representa el estado de validación y mensaje de error de un control de formulario.
 */
export interface FormControlError {
  /** Estado del control ('error' cuando es inválido e interactuado, o '' si es válido) */
  state: 'error' | '';

  /** Mensaje legible del error obtenido desde {@link ErrorMessage} */
  error: string;
}

/**
 * ============================================================================
 * FormModel Base Class
 * ============================================================================
 * Clase base para modelos de formulario reactivo en la arquitectura empresarial.
 *
 * @remarks
 * Proporciona métodos transversales para inspeccionar y extraer mensajes de error
 * contextuales de cualquier `AbstractControl` perteneciente a un {@link FormGroup}.
 * Evalúa las condiciones de interacción (`touched` o `dirty`) antes de emitir errores,
 * evitando alertas prematuras antes de que el usuario haya interactuado con el campo.
 */
export class FormModel {
  /**
   * Obtiene el mensaje de error correspondiente al primer validador fallido de un control.
   *
   * @param control - Nombre de la propiedad o control registrado en el `FormGroup`.
   * @param form - Instancia del `FormGroup` que contiene el control.
   * @returns Un objeto {@link FormControlError} con el estado ('error' o '') y el texto del error.
   *
   * @throws {Error} Si el nombre del control especificado no existe en el `FormGroup`.
   *
   * @example
   * ```typescript
   * const errorInfo = this.formModel.getErrorMessage('name', this.form);
   * if (errorInfo.state === 'error') {
   *   console.log(errorInfo.error); // 'Este campo es obligatorio.'
   * }
   * ```
   */
  public getErrorMessage(control: string, form: FormGroup): FormControlError {
    const controlRef = form.get(control);
    if (!controlRef) {
      throw new Error(`El control '${control}' no existe en el FormGroup.`);
    }

    const { touched, dirty, errors } = controlRef;
    const message: FormControlError = { state: '', error: '' };

    // Si el usuario no ha interactuado con el control o no hay errores, se retorna estado limpio
    if ((!touched && !dirty) || !errors) {
      return message;
    }

    // Se extrae la primera clave de error registrada por los validadores
    const typeError = Object.keys(errors)[0];
    if (typeError) {
      message.error = ErrorMessage[String(typeError)] ?? 'Error de validación.';
      message.state = 'error';
    }

    return message;
  }
}
