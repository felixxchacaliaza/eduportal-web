import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { GradeSubject } from '../models/interfaces/grade-subject.interface';

@Injectable({
  providedIn: 'root',
})
export class GradeSubjectService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.gradeSubjects;

  /**
   * 1. Listar la malla curricular de asignaturas por grado
   * GET /api/grade-subjects?grade=...&academicYear=...&enabled=...
   */
  public async getGradeSubjects(filter?: {
    grade?: string;
    academicYear?: string;
    enabled?: boolean;
  }): Promise<GradeSubject[]> {
    let params = new HttpParams();
    if (filter?.grade) {
      params = params.set('grade', filter.grade);
    }
    if (filter?.academicYear) {
      params = params.set('academicYear', filter.academicYear);
    }
    if (filter?.enabled !== undefined) {
      params = params.set('enabled', String(filter.enabled));
    }

    const response = await firstValueFrom(
      this.http.get<ApiResponse<GradeSubject[]>>(this.endpoint, { params })
    );
    return response.data;
  }

  /**
   * 2. Obtener asignación curricular por ID
   * GET /api/grade-subjects/:id
   */
  public async getGradeSubjectById(id: string): Promise<GradeSubject> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<GradeSubject>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }

  /**
   * 3. Asignar una materia a un grado escolar
   * POST /api/grade-subjects
   */
  public async createGradeSubject(payload: {
    grade: string;
    subject: string;
    academicYear?: string;
    weeklyHours?: number;
    enabled?: boolean;
  }): Promise<GradeSubject> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<GradeSubject>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * 4. Editar asignación curricular (modificar horas semanales o estado enabled)
   * PUT /api/grade-subjects/:id
   */
  public async updateGradeSubject(
    id: string,
    payload: { weeklyHours?: number; enabled?: boolean; code?: string }
  ): Promise<GradeSubject> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<GradeSubject>>(`${this.endpoint}/${id}`, payload)
    );
    return response.data;
  }
}

