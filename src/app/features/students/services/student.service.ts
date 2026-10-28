import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/models/interfaces/api-response.interface';
import {
  IStudent,
  ICreateStudentRequestDto,
  IUpdateStudentRequestDto
} from '../models';

/**
 * ============================================================================
 * StudentService
 * ============================================================================
 * Servicio HTTP para la administración del padrón escolar de estudiantes.
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
   * Obtiene la lista de estudiantes registrados (soporta filtro de búsqueda).
   */
  public async getStudents(search?: string): Promise<IStudent[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    const response = await firstValueFrom(
      this.http.get<ApiResponse<IStudent[]>>(this.endpoint, { params })
    );
    return response.data || [];
  }

  /**
   * Consulta el expediente completo de un alumno por ID.
   */
  public async getStudentById(id: string): Promise<IStudent> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IStudent>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }

  /**
   * Registra un nuevo estudiante junto a sus apoderados.
   */
  public async createStudent(payload: ICreateStudentRequestDto): Promise<IStudent> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<IStudent>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * Actualiza los datos de un estudiante o sus apoderados.
   */
  public async updateStudent(id: string, payload: IUpdateStudentRequestDto): Promise<IStudent> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<IStudent>>(`${this.endpoint}/${id}`, payload)
    );
    return response.data;
  }

  /**
   * Realiza la baja lógica de un estudiante.
   */
  public async deleteStudent(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<ApiResponse<void>>(`${this.endpoint}/${id}`)
    );
  }
}
