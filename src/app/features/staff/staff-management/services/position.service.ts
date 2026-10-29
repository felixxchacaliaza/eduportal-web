import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import { IPosition } from '../models';

/**
 * ============================================================================
 * PositionService
 * ============================================================================
 * Servicio HTTP para el catálogo de cargos laborales institucionales.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.positions;

  /**
   * Obtiene la lista completa de cargos laborales institucionales activos.
   */
  public async getPositions(): Promise<IPosition[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IPosition[]>>(this.endpoint)
    );
    return response.data || [];
  }

  /**
   * Obtiene el detalle de un cargo por su identificador único.
   */
  public async getPositionById(id: string): Promise<IPosition> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IPosition>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }
}
