import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * SUBJECTS_SAVE_DIALOG_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable que encapsula la configuración visual y descriptiva
 * de cada campo del formulario de guardado y edición de asignaturas.
 *
 * @remarks
 * Provee valores estandarizados para etiquetas (<label>), placeholders,
 * iconos de Angular Material (prefix) y restricciones de validación.
 * Al estar congelado (`Object.freeze`), previene mutaciones accidentales en tiempo de ejecución.
 * ============================================================================
 */
export const SUBJECTS_SAVE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  /** Configuración del campo de nombre de asignatura */
  name: Object.freeze({
    formControlName: 'name',
    label: 'Nombre de la Asignatura',
    placeHolder: 'Ej: Matemática, Comunicación, Física',
    type: 'text',
    validators: {
      minLength: 3,
      maxLength: 100,
    },
    iconLeft: 'book',
  }),

  /** Configuración del selector de área curricular */
  area: Object.freeze({
    formControlName: 'area',
    label: 'Área Curricular',
    placeHolder: 'Seleccione un área curricular',
    iconLeft: 'category',
  }),

  /** Configuración del campo numérico de horas semanales */
  weeklyHours: Object.freeze({
    formControlName: 'weeklyHours',
    label: 'Horas Semanales',
    placeHolder: 'Ej: 4',
    type: 'number',
    validators: {
      min: 1,
      max: 20,
    },
    iconLeft: 'schedule',
  }),

  /** Configuración del área de texto para observaciones pedagógicas */
  description: Object.freeze({
    formControlName: 'description',
    label: 'Descripción u Observaciones (Opcional)',
    placeHolder: 'Objetivos pedagógicos, competencias o notas sobre la materia...',
    type: 'text',
  }),
});
