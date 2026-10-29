import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import { IAttendance } from '../models/attendance.interface';
import { BulkAttendanceRequestDto } from '../models/bulk-attendance-request.dto';

/**
 * ============================================================================
 * AttendanceService
 * ============================================================================
 * Servicio reactivo para la consulta de asistencias y registro masivo diario.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.attendances;

  /**
   * Consulta las asistencias de un salón en una fecha específica.
   */
  public async getBySectionAndDate(gradeSection: string, date: string): Promise<IAttendance[]> {
    const params = new HttpParams()
      .set('gradeSection', gradeSection)
      .set('date', date);

    const response = await firstValueFrom(
      this.http.get<ApiResponse<IAttendance[]>>(`${this.endpoint}/section-date`, { params })
    );

    return response.data || [];
  }

  /**
   * Consulta el histórico de asistencias con filtros opcionales.
   */
  public async getAll(filterParams?: {
    gradeSection?: string;
    student?: string;
    academicYear?: string;
    status?: string;
  }): Promise<IAttendance[]> {
    let params = new HttpParams();
    if (filterParams?.gradeSection) params = params.set('gradeSection', filterParams.gradeSection);
    if (filterParams?.student) params = params.set('student', filterParams.student);
    if (filterParams?.academicYear) params = params.set('academicYear', filterParams.academicYear);
    if (filterParams?.status) params = params.set('status', filterParams.status);

    const response = await firstValueFrom(
      this.http.get<ApiResponse<IAttendance[]>>(this.endpoint, { params })
    );

    return response.data || [];
  }

  /**
   * Registra o actualiza en lote la asistencia de los alumnos de un salón.
   */
  public async bulkRegister(payload: BulkAttendanceRequestDto): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<any[]>>(`${this.endpoint}/bulk`, payload)
    );

    return response.data || [];
  }
}
