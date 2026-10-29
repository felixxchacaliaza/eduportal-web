import { Validators } from '@angular/forms';
import { FormModel } from '../../../../../shared/class/form-model';

/**
 * ============================================================================
 * GradeBookFormModel
 * ============================================================================
 * Modelo reactivo para el control del libro de calificaciones y filtros.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
export class GradeBookFormModel extends FormModel {
  /** Identificador del salón escolar */
  gradeSectionId = ['', [Validators.required]];

  /** Identificador de la materia curricular */
  subjectId = ['', [Validators.required]];

  /** Año lectivo oficial */
  academicYear = ['2026', [Validators.required]];
}
