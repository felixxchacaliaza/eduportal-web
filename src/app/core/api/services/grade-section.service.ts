import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { GradeSection, Section, Classroom } from '../models/interfaces/grade-section.interface';
import { ApiResponse } from '../models/interfaces/api-response.interface';

/**
 * ============================================================================
 * GradeSectionService (Infraestructura HTTP)
 * ============================================================================
 * Provee la comunicación REST con el backend para la administración de Aulas,
 * Secciones alfabéticas y apertura de Salones Escolares.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * - Soporta respuestas directas en arreglo o envueltas en el contrato estándar
 *   `ApiResponse<T>`, garantizando tolerancia a fallos en el parsing.
 * - Utiliza `firstValueFrom` para un consumo asíncrono limpio con `async/await`.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root',
})
export class GradeSectionService {
  private readonly http = inject(HttpClient);

  /**
   * Consulta las secciones aperturadas filtradas por año académico o grado.
   */
  public async getGradeSections(params?: { academicYear?: string; grade?: string; enabled?: boolean }): Promise<GradeSection[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<GradeSection[]> | GradeSection[]>(API_ENDPOINTS.gradeSections, { params: params as any })
    );
    return Array.isArray(res) ? res : res.data;
  }

  /**
   * Consulta el catálogo maestro de secciones alfabéticas (A, B, C, etc.).
   */
  public async getSections(): Promise<Section[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Section[]> | Section[]>(API_ENDPOINTS.sections)
    );
    return Array.isArray(res) ? res : res.data;
  }

  /**
   * Consulta el catálogo maestro de aulas físicas con sus capacidades.
   */
  public async getClassrooms(): Promise<Classroom[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Classroom[]> | Classroom[]>(API_ENDPOINTS.classrooms)
    );
    return Array.isArray(res) ? res : res.data;
  }

  /**
   * Registra una nueva sección aperturada en el periodo escolar.
   */
  public async createGradeSection(payload: Partial<GradeSection>): Promise<GradeSection> {
    const res = await firstValueFrom(
      this.http.post<ApiResponse<GradeSection> | GradeSection>(API_ENDPOINTS.gradeSections, payload)
    );
    return (res as ApiResponse<GradeSection>).data || (res as GradeSection);
  }

  /**
   * Actualiza los datos de una sección aperturada (ej. alternar estado o reasignar aula).
   */
  public async updateGradeSection(id: string, payload: Partial<GradeSection>): Promise<GradeSection> {
    const res = await firstValueFrom(
      this.http.put<ApiResponse<GradeSection> | GradeSection>(`${API_ENDPOINTS.gradeSections}/${id}`, payload)
    );
    return (res as ApiResponse<GradeSection>).data || (res as GradeSection);
  }

  /**
   * Elimina un registro de sección aperturada por su ID.
   */
  public async deleteGradeSection(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_ENDPOINTS.gradeSections}/${id}`));
  }
}
