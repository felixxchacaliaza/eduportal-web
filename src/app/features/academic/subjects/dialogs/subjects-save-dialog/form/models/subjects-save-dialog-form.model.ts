import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../../../shared/class/form-model';

/**
 * ============================================================================
 * SubjectsSaveDialogFormModel
 * ============================================================================
 * Modelo reactivo de controles para el formulario de guardado y edición de asignaturas.
 *
 * @remarks
 * Extiende de {@link FormModel} para heredar la resolución automática de mensajes
 * de error (`getErrorMessage`). Define las propiedades de los controles mediante
 * el formato canónico `[valorInicial, validadores]`, permitiendo la inicialización
 * directa mediante `FormBuilder.group(new SubjectsSaveDialogFormModel())`.
 * ============================================================================
 */
export class SubjectsSaveDialogFormModel extends FormModel {
  /**
   * Control para el nombre de la asignatura.
   * Reglas: Requerido, longitud mínima de 3 caracteres.
   */
  name = ['', [Validators.required, Validators.minLength(3)]];

  /**
   * Control para el área curricular académica.
   * Reglas: Requerido.
   */
  area = ['', [Validators.required]];

  /**
   * Control para las horas semanales de dictado.
   * Reglas: Requerido, rango numérico entre 1 y 20 horas.
   */
  weeklyHours = [2, [Validators.required, Validators.min(1), Validators.max(20)]];

  /**
   * Control para observaciones pedagógicas y competencias.
   * Reglas: Opcional.
   */
  description = [''];
}
