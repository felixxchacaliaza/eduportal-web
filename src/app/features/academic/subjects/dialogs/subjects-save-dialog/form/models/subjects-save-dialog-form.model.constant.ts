import { FormHtml } from '../../../../../../../shared/interfaces/form-html';

export const SUBJECTS_SAVE_DIALOG_FORM_MODEL_CONSTANT: Record<string, FormHtml> = Object.freeze({
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

  area: Object.freeze({
    formControlName: 'area',
    label: 'Área Curricular',
    placeHolder: 'Seleccione un área curricular',
    iconLeft: 'category',
  }),

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

  description: Object.freeze({
    formControlName: 'description',
    label: 'Descripción u Observaciones (Opcional)',
    placeHolder: 'Objetivos pedagógicos, competencias o notas sobre la materia...',
    type: 'text',
  }),
});