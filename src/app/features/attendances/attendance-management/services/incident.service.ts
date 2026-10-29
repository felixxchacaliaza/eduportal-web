import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import { IIncident } from '../models/incident.interface';

/**
 * ============================================================================
 * IncidentService
 * ============================================================================
 * Servicio reactivo para la gestión y reporte de incidencias escolares.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.incidents;

  /**
   * Obtiene la lista de incidencias registradas con filtros opcionales.
   */
  public async getAll(filterParams?: { student?: string; academicYear?: string }): Promise<IIncident[]> {
    let params = new HttpParams();
    if (filterParams?.student) params = params.set('student', filterParams.student);
    if (filterParams?.academicYear) params = params.set('academicYear', filterParams.academicYear);

    const response = await firstValueFrom(
      this.http.get<ApiResponse<IIncident[]>>(this.endpoint, { params })
    );

    return response.data || [];
  }

  /**
   * Obtiene las incidencias reportadas para un estudiante específico.
   */
  public async getByStudent(studentId: string): Promise<IIncident[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IIncident[]>>(`${this.endpoint}/student/${studentId}`)
    );

    return response.data || [];
  }

  /**
   * Registra una nueva incidencia de conducta o disciplina.
   */
  public async create(payload: Partial<IIncident>): Promise<IIncident> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<IIncident>>(this.endpoint, payload)
    );

    return response.data;
  }

  /**
   * Actualiza el estado y acción tomada sobre una incidencia reportada.
   */
  public async updateStatus(id: string, status: string, actionTaken?: string): Promise<IIncident> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<IIncident>>(`${this.endpoint}/${id}/status`, { status, actionTaken })
    );

    return response.data;
  }
}
