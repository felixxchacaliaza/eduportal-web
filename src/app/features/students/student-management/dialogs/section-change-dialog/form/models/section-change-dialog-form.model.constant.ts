import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT
 * ============================================================================
 * Metadatos inmutables para el formulario de cambio de sección escolar.
 * ============================================================================
 */
export const SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  gradeSection: Object.freeze({
    formControlName: 'gradeSection',
    label: 'Nueva Sección de Destino',
    placeHolder: 'Seleccione el aula con vacantes disponibles...',
    iconLeft: 'swap_horiz'
  })
});
