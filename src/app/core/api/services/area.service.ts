import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Area } from '../models/interfaces/area.interface';

/**
 * ============================================================================
 * AreaService (Core API Service)
 * ============================================================================
 * Servicio HTTP para la gestión de Áreas Curriculares (Colección `areas`).
 * ============================================================================
 */
@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.areas;

  /**
   * Listar todas las áreas curriculares
   */
  public async getAreas(): Promise<Area[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Area[]>>(this.endpoint)
    );
    return response.data;
  }

  /**
   * Obtener área curricular por ID o CODE
   */
  public async getAreaById(id: string): Promise<Area> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Area>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }

  /**
   * Registrar una nueva área curricular
   */
  public async createArea(payload: Partial<Area>): Promise<Area> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Area>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * Actualizar área curricular por ID
   */
  public async updateArea(id: string, payload: Partial<Area>): Promise<Area> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<Area>>(`${this.endpoint}/${id}`, payload)
    );
    return response.data;
  }
}
