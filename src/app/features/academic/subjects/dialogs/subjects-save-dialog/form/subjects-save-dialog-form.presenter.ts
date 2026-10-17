import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubjectItem } from '../../../subjects.presenter';
import { SubjectsSaveFormPayload } from '../models/interfaces/subjects-save-form-payload.interface';
import { SubjectsSaveDialogFormModel } from './models/subjects-save-dialog-form.model';
import { SUBJECTS_SAVE_DIALOG_FORM_MODEL_CONSTANT } from './models/subjects-save-dialog-form.model.constant';
import { SubjectsSaveDialogFormModelInterface } from './models/subjects-save-dialog-form.model.interface';
import { FormControlError } from '../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * SubjectsSaveDialogFormPresenter
 * ============================================================================
 * Presentador especializado para la gestión del formulario reactivo de asignaturas.
 *
 * @remarks
 * Implementa el patrón **Form Presenter** desacoplando la lógica del formulario del template:
 * - **Construcción:** Instancia y tipa el {@link FormGroup} a partir del modelo {@link SubjectsSaveDialogFormModel}.
 * - **Ciclo de Vida:** Gestiona la precarga de datos al editar (`preloadData`) y el reseteo (`resetForm`).
 * - **Validaciones y Errores:** Resuelve mensajes contextuales mediante {@link FormModel.getErrorMessage}.
 * - **Mapeo:** Transforma los valores capturados en un payload inmutable {@link SubjectsSaveFormPayload}.
 * ============================================================================
 */
@Injectable()
export class SubjectsSaveDialogFormPresenter {
  /** Inyección del servicio FormBuilder para la instanciación de controles */
  private readonly fb = inject(FormBuilder);

  /** Instancia del modelo que define controles y reglas de validación */
  public readonly formModel = new SubjectsSaveDialogFormModel();

  /** Constante inmutable con metadata visual de UI (etiquetas, placeholders, iconos) */
  public readonly formConstant = SUBJECTS_SAVE_DIALOG_FORM_MODEL_CONSTANT;

  /** Instancia activa del formulario reactivo */
  public readonly form: FormGroup = this.fb.group(new SubjectsSaveDialogFormModel());

  /**
   * Precarga los valores de una asignatura existente en los controles del formulario (Modo Edición).
   *
   * @param data - Datos de la asignatura seleccionada desde la tabla o catálogo.
   */
  public preloadData(data: SubjectItem): void {
    this.form.patchValue({
      name: data.name,
      area: data.areaId || data.area,
      weeklyHours: data.hours,
      description: data.description ?? '',
    });
  }

  /**
   * Restablece todos los campos del formulario a sus valores predeterminados (Modo Creación).
   */
  public resetForm(): void {
    this.form.reset({
      name: '',
      area: '',
      weeklyHours: 2,
      description: '',
    });
  }

  /**
   * Obtiene el estado y mensaje de validación para un campo específico del formulario.
   *
   * @param control - Nombre del control evaluado (ej. 'name', 'area', 'weeklyHours').
   * @returns Objeto {@link FormControlError} con la propiedad `state` ('error' o '') y el texto `error`.
   */
  public getErrorMessage(control: string): FormControlError {
    return this.formModel.getErrorMessage(control, this.form);
  }

  /**
   * Extrae los valores actuales del formulario y los formatea como un payload limpio para el backend.
   *
   * @returns Estructura tipada {@link SubjectsSaveFormPayload} con valores saneados.
   */
  public getPayload(): SubjectsSaveFormPayload {
    const value = this.form.getRawValue() as SubjectsSaveDialogFormModelInterface;
    return {
      name: value.name?.trim() ?? '',
      area: value.area ?? '',
      weeklyHours: Number(value.weeklyHours ?? 2),
      description: value.description?.trim() || undefined,
    };
  }

  /**
   * Marca todos los controles como tocados (`touched`), forzando la renderización de errores si es inválido.
   */
  public markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }
}
