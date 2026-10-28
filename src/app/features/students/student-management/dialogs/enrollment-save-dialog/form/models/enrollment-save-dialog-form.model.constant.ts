import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable de metadata visual para el formulario de matrícula.
 * ============================================================================
 */
export const ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  gradeSection: Object.freeze({
    formControlName: 'gradeSection',
    label: 'Salón Escolar (Grado, Sección y Aforo)',
    placeHolder: 'Seleccione un salón aperturado...',
    iconLeft: 'meeting_room'
  }),
  academicYear: Object.freeze({
    formControlName: 'academicYear',
    label: 'Año Lectivo',
    placeHolder: '2026',
    type: 'text',
    iconLeft: 'event',
    validators: { minLength: 4, maxLength: 4 }
  }),
  enrollmentType: Object.freeze({
    formControlName: 'enrollmentType',
    label: 'Tipo de Matrícula',
    iconLeft: 'category'
  }),
  status: Object.freeze({
    formControlName: 'status',
    label: 'Condición de Matrícula',
    iconLeft: 'how_to_reg'
  }),
  observation: Object.freeze({
    formControlName: 'observation',
    label: 'Observaciones Adicionales',
    placeHolder: 'Compromisos de rendimiento o conducta...',
    type: 'text',
    iconLeft: 'notes'
  })
});
