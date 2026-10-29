import { FormHtml } from '../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * ATTENDANCE_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable con metadata visual para los controles de asistencia.
 * Regla: 1 sola declaración principal por archivo.
 * ============================================================================
 */
export const ATTENDANCE_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  date: Object.freeze({
    formControlName: 'date',
    label: 'Fecha de Asistencia',
    placeHolder: 'YYYY-MM-DD',
    type: 'date',
    iconLeft: 'calendar_today'
  }),
  gradeSection: Object.freeze({
    formControlName: 'gradeSection',
    label: 'Salón y Sección',
    placeHolder: 'Seleccione salón...',
    type: 'select',
    iconLeft: 'class'
  }),
  status: Object.freeze({
    formControlName: 'status',
    label: 'Estado de Asistencia',
    type: 'radio',
    iconLeft: 'fact_check'
  }),
  observation: Object.freeze({
    formControlName: 'observation',
    label: 'Observaciones',
    placeHolder: 'Comentarios...',
    type: 'text',
    iconLeft: 'comment',
    validators: { maxLength: 200 }
  })
});
