import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { AcademicYear } from '../models/interfaces/academic-year.interface';

@Injectable({
  providedIn: 'root',
})
export class AcademicYearService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.academicYears;

  /**
   * 1. Listar todos los años lectivos (opcionalmente filtrados por status o enabled)
   * GET /api/academic-years
   */
  public async getAcademicYears(params?: { status?: string; enabled?: boolean }): Promise<AcademicYear[]> {
    let httpParams = new HttpParams();
    if (params?.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params?.enabled !== undefined) {
      httpParams = httpParams.set('enabled', String(params.enabled));
    }

    const response = await firstValueFrom(
      this.http.get<ApiResponse<AcademicYear[]>>(this.endpoint, { params: httpParams })
    );
    return response.data;
  }

  /**
   * 2. Obtener un año lectivo por ID o año (ej: "2026")
   * GET /api/academic-years/:id
   */
  public async getAcademicYearByIdOrYear(idOrYear: string): Promise<AcademicYear> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<AcademicYear>>(`${this.endpoint}/${idOrYear}`)
    );
    return response.data;
  }
}

