import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import {
  IStudent,
  ICreateStudentRequestDto,
  IUpdateStudentRequestDto
} from '../models';

/**
 * ============================================================================
 * StudentService
 * ============================================================================
 * Servicio HTTP para la gestión integral del padrón de alumnos.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.students;

  /**
   * Obtiene la lista completa de estudiantes (con apoderados y personas pobladas).
   */
  public async getStudents(status?: 'ACTIVE' | 'INACTIVE'): Promise<IStudent[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IStudent[]>>(this.endpoint, { params })
    );
    return response.data || [];
  }

  /**
   * Obtiene el detalle de un estudiante por su ObjectId.
   */
  public async getStudentById(id: string): Promise<IStudent> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IStudent>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }

  /**
   * Registra un nuevo alumno junto con su vinculación a persona y apoderados.
   */
  public async createStudent(payload: ICreateStudentRequestDto): Promise<IStudent> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<IStudent>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * Actualiza los datos de un alumno existente.
   */
  public async updateStudent(id: string, payload: IUpdateStudentRequestDto): Promise<IStudent> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<IStudent>>(`${this.endpoint}/${id}`, payload)
    );
    return response.data;
  }

  /**
   * Ejecuta la baja lógica de un alumno.
   */
  public async deleteStudent(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.endpoint}/${id}`));
  }
}
