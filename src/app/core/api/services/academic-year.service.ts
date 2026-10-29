// src/app/core/api/services/academic-year.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { AcademicYear } from '../models/interfaces/academic-year.interface';

/**
 * ============================================================================
 * AcademicYearService
 * ============================================================================
 * Gestión del ciclo lectivo institucional y control de bloqueo reactivo.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root',
})
export class AcademicYearService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.academicYears;

  /** Año lectivo activo seleccionado en la plataforma */
  public readonly activeYear = signal<string>('2026');

  /** Entidad completa del año lectivo cargado */
  public readonly activeYearData = signal<AcademicYear | null>(null);

  /**
   * Signal computado: Indica si el año lectivo se encuentra cerrado
   * impidiendo operaciones de mutación o apertura de periodos.
   */
  public readonly isYearLocked = computed<boolean>(() => {
    const current = this.activeYearData();
    return current ? current.status === 'CERRADO' : false;
  });

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

  /**
   * 3. Cargar y establecer reactivamente el año escolar activo
   */
  public async loadActiveYear(year: string = '2026'): Promise<AcademicYear> {
    const data = await this.getAcademicYearByIdOrYear(year);
    this.activeYear.set(year);
    this.activeYearData.set(data);
    return data;
  }
}
