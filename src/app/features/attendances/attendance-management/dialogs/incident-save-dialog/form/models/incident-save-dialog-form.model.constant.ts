import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

/**
 * ============================================================================
 * INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT
 * ============================================================================
 * Constante inmutable de metadata visual para el formulario de incidencias.
 * Regla: 1 sola declaración principal por archivo.
 * ============================================================================
 */
export const INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
  title: Object.freeze({
    formControlName: 'title',
    label: 'Título de la Incidencia',
    placeHolder: 'Ej: Llegada tardía reiterada o conducta destacada',
    type: 'text',
    iconLeft: 'label',
    validators: { minLength: 3, maxLength: 100 }
  }),
  type: Object.freeze({
    formControlName: 'type',
    label: 'Tipo de Incidencia',
    placeHolder: 'Seleccione el tipo',
    type: 'select',
    iconLeft: 'category'
  }),
  severity: Object.freeze({
    formControlName: 'severity',
    label: 'Gravedad del Suceso',
    placeHolder: 'Seleccione gravedad',
    type: 'select',
    iconLeft: 'priority_high'
  }),
  description: Object.freeze({
    formControlName: 'description',
    label: 'Descripción Detallada',
    placeHolder: 'Detalle lo acontecido, circunstancias y testimonios...',
    type: 'textarea',
    iconLeft: 'notes',
    validators: { minLength: 5, maxLength: 500 }
  }),
  actionTaken: Object.freeze({
    formControlName: 'actionTaken',
    label: 'Acción Tomada / Medida Correctiva',
    placeHolder: 'Ej: Se comunicó al apoderado o se brindó tutoría...',
    type: 'textarea',
    iconLeft: 'rule',
    validators: { maxLength: 300 }
  })
});
