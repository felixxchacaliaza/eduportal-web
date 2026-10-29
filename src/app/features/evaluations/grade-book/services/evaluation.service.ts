import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import { IEvaluation } from '../models/evaluation.interface';
import { IGradeBookFilter } from '../models/grade-book-filter.interface';
import { BulkEvaluationRequestDto } from '../models/bulk-evaluation-request.dto';
import { EvaluationPeriodConfig } from '../models/evaluation-period-config.interface';
import { RuleService } from '../../../../core/api/services/rule.service';

/**
 * ============================================================================
 * EvaluationService
 * ============================================================================
 * Servicio reactivo para la consulta de actas de notas, actualización masiva
 * por lote y obtención de reglas de evaluación institucional MINEDU (RUL-004).
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly http = inject(HttpClient);
  private readonly ruleService = inject(RuleService);
  private readonly endpoint = API_ENDPOINTS.evaluations;

  /**
   * Obtiene la matriz de evaluaciones de un salón y asignatura en un año escolar.
   */
  public async getMatrix(filter: IGradeBookFilter): Promise<IEvaluation[]> {
    let params = new HttpParams()
      .set('academicYear', filter.academicYear);

    if (filter.gradeSectionId) {
      params = params.set('gradeSection', filter.gradeSectionId);
    }
    if (filter.subjectId) {
      params = params.set('subject', filter.subjectId);
    }

    const response = await firstValueFrom(
      this.http.get<ApiResponse<IEvaluation[]>>(`${this.endpoint}/matrix`, { params })
    );

    return response.data || [];
  }

  /**
   * Actualiza en lote las calificaciones de los estudiantes respetando candados isOpen.
   */
  public async bulkUpdate(payload: BulkEvaluationRequestDto): Promise<IEvaluation[]> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<IEvaluation[]>>(`${this.endpoint}/bulk-update`, payload)
    );

    return response.data || [];
  }

  /**
   * Obtiene la configuración de periodos escolares y candados isOpen según RUL-004.
   */
  public async getEvaluationPeriods(academicYear: string = '2026'): Promise<EvaluationPeriodConfig[]> {
    try {
      const rules = await this.ruleService.getRules(academicYear);
      const periodRule = rules.find(r => r.code === 'RUL-004' || r.key === 'EVALUATION_PERIODS');

      const periods = periodRule?.currentValue?.periods || periodRule?.value?.periods;
      if (Array.isArray(periods) && periods.length > 0) {
        return periods;
      }
    } catch (error) {
      console.warn('No se pudo cargar regla RUL-004, usando configuración por defecto:', error);
    }

    // Fallback estándar MINEDU: 4 Bimestres (B3 y B4 cerrados)
    return [
      { period: 1, name: 'Bimestre 1', weight: 25, isOpen: true },
      { period: 2, name: 'Bimestre 2', weight: 25, isOpen: true },
      { period: 3, name: 'Bimestre 3', weight: 25, isOpen: false },
      { period: 4, name: 'Bimestre 4', weight: 25, isOpen: false }
    ];
  }
}
