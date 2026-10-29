import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
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
   * Obtiene los alumnos matriculados en una sección específica.
   */
  public async getBySection(sectionId: string): Promise<IEnrollment[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IEnrollment[]>>(`${this.endpoint}/by-section/${sectionId}`)
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
   * Realiza el cambio/traslado de sección escolar de una matrícula existente.
   */
  public async changeSection(enrollmentId: string, gradeSectionId: string): Promise<IEnrollment> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<IEnrollment>>(`${this.endpoint}/${enrollmentId}/section`, {
        gradeSection: gradeSectionId
      })
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
    return rawList.map((item: IGradeSectionSummary) => ({
      ...item,
      availableVacancies: Math.max(0, (item.maxCapacity || 0) - (item.enrolledStudents || 0))
    }));
  }
}
