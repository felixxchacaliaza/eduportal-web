import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/models/interfaces/api-response.interface';
import {
  IEnrollment,
  IEnrollStudentRequestDto,
  IGradeSectionSummary
} from '../models';

/**
 * ============================================================================
 * EnrollmentService
 * ============================================================================
 * Servicio HTTP para la gestión de matrículas anuales y consulta de aforos.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.enrollments;
  private readonly gradeSectionsEndpoint = API_ENDPOINTS.gradeSections;

  /**
   * Obtiene la lista de matrículas por año lectivo.
   */
  public async getEnrollments(academicYear = '2026'): Promise<IEnrollment[]> {
    const params = new HttpParams().set('academicYear', academicYear);
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IEnrollment[]>>(this.endpoint, { params })
    );
    return response.data || [];
  }

  /**
   * Ejecuta la matrícula de un alumno en un salón escolar.
   */
  public async enrollStudent(payload: IEnrollStudentRequestDto): Promise<IEnrollment> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<IEnrollment>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * Obtiene los salones activos del año escolar con aforo y vacantes calculadas.
   */
  public async getActiveGradeSections(academicYear = '2026'): Promise<IGradeSectionSummary[]> {
    const params = new HttpParams().set('academicYear', academicYear);
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IGradeSectionSummary[]>>(this.gradeSectionsEndpoint, { params })
    );
    const rawList = response.data || [];

    // Calcular vacantes disponibles en tiempo real (maxCapacity - enrolledStudents)
    return rawList.map(item => ({
      ...item,
      availableVacancies: Math.max(0, (item.maxCapacity || 0) - (item.enrolledStudents || 0))
    }));
  }
}
