import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Subject } from '../models/interfaces/subject.interface';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.subjects;

  /**
   * 1. Listar todas las asignaturas (Promesa con async / await)
   * GET /api/subjects (SubjectController.getSubjects)
   */
  public async getSubjects(): Promise<Subject[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Subject[]>>(this.endpoint)
    );
    return response.data;
  }

  /**
   * 2. Obtener asignatura por ID (Promesa con async / await)
   * GET /api/subjects/:id (SubjectController.getSubjectById)
   */
  public async getSubjectById(id: string): Promise<Subject> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Subject>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }

  /**
   * 3. Registrar una nueva asignatura (Promesa con async / await)
   * POST /api/subjects (SubjectController.createSubject)
   */
  public async createSubject(payload: Record<string, unknown>): Promise<Subject> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Subject>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * 4. Modificar una asignatura existente por ID (Promesa con async / await)
   * PUT /api/subjects/:id (SubjectController.updateSubject)
   */
  public async updateSubject(id: string, payload: Record<string, unknown>): Promise<Subject> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<Subject>>(`${this.endpoint}/${id}`, payload)
    );
    return response.data;
  }
}

