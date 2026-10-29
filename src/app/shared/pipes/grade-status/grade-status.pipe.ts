import { Pipe, PipeTransform } from '@angular/core';

/**
 * ============================================================================
 * GradeStatusPipe
 * ============================================================================
 * Pipe puro para transformar notas vigesimales en diagnósticos académicos MINEDU.
 *
 * @remarks
 * Regla RUL-005:
 * - >= 11: 'Aprobado'
 * - < 11: 'Desaprobado'
 * - null / undefined / vacío: 'Pendiente'
 * ============================================================================
 */
@Pipe({
  name: 'gradeStatus',
  standalone: true,
  pure: true
})
export class GradeStatusPipe implements PipeTransform {
  public transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'Pendiente';
    }

    const num = typeof value === 'number' ? value : parseFloat(String(value).trim());
    if (isNaN(num)) {
      return 'Pendiente';
    }

    return num >= 11 ? 'Aprobado' : 'Desaprobado';
  }
}
