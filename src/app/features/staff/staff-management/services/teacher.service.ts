import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import {
  ITeacher,
  ICreateTeacherRequestDto,
  IUpdateTeacherRequestDto
} from '../models';

/**
 * ============================================================================
 * TeacherService
 * ============================================================================
 * Servicio HTTP para la gestión de la plana docente escolar.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.teachers;

  /**
   * Obtiene la nómina de profesores con datos civiles y área curricular poblados.
   */
  public async getTeachers(status?: 'ACTIVE' | 'INACTIVE'): Promise<ITeacher[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ITeacher[]>>(this.endpoint, { params })
    );
    return response.data || [];
  }

  /**
   * Obtiene el detalle de un docente por su identificador.
   */
  public async getTeacherById(id: string): Promise<ITeacher> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ITeacher>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }

  /**
   * Registra un nuevo profesor con validación de incompatibilidad (RN-ACT-01).
   */
  public async createTeacher(payload: ICreateTeacherRequestDto): Promise<ITeacher> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ITeacher>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * Actualiza los datos laborales y de contacto de un docente.
   */
  public async updateTeacher(id: string, payload: IUpdateTeacherRequestDto): Promise<ITeacher> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<ITeacher>>(`${this.endpoint}/${id}`, payload)
    );
    return response.data;
  }

  /**
   * Alterna el estado activo/inactivo (baja lógica) de un profesor.
   */
  public async toggleTeacherStatus(id: string): Promise<ITeacher> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<ITeacher>>(`${this.endpoint}/${id}/toggle`, {})
    );
    return response.data;
  }
}
