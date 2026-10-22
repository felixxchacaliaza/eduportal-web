import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Grade } from '../models/interfaces/grade.interface';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.grades;

  /**
   * 1. Listar todos los grados escolares
   * GET /api/grades
   */
  public async getGrades(): Promise<Grade[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Grade[]>>(this.endpoint)
    );
    return response.data;
  }

  /**
   * 2. Obtener un grado por ID
   * GET /api/grades/:id
   */
  public async getGradeById(id: string): Promise<Grade> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Grade>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }
}

