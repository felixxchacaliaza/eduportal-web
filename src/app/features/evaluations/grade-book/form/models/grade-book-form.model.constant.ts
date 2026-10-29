import { FormHtml } from '../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * GRADE_BOOK_FORM_MODEL_CONSTANT
 * ============================================================================
 * Metadata visual inmutable para los selectores y controles de la matriz de notas.
 * ============================================================================
 */
export const GRADE_BOOK_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  gradeSectionId: Object.freeze({
    formControlName: 'gradeSectionId',
    label: 'Salón y Sección',
    placeHolder: 'Seleccione grado y sección...',
    iconLeft: 'meeting_room'
  }),
  subjectId: Object.freeze({
    formControlName: 'subjectId',
    label: 'Asignatura',
    placeHolder: 'Seleccione asignatura curricular...',
    iconLeft: 'menu_book'
  }),
  academicYear: Object.freeze({
    formControlName: 'academicYear',
    label: 'Año Lectivo',
    placeHolder: 'Ej. 2026',
    iconLeft: 'calendar_today'
  }),
  observation: Object.freeze({
    formControlName: 'observation',
    label: 'Observación Pedagógica',
    placeHolder: 'Anotación cualitativa o justificación...',
    type: 'text',
    iconLeft: 'notes',
    validators: { maxLength: 250 }
  })
});
