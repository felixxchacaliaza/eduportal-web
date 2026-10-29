import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import {
  IWorker,
  ICreateWorkerRequestDto,
  IUpdateWorkerRequestDto
} from '../models';

/**
 * ============================================================================
 * WorkerService
 * ============================================================================
 * Servicio HTTP para la gestión del personal administrativo y de soporte.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.workers;

  /**
   * Obtiene la nómina de trabajadores administrativos con persona y cargo poblados.
   */
  public async getWorkers(status?: 'ACTIVO' | 'INACTIVO'): Promise<IWorker[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IWorker[]>>(this.endpoint, { params })
    );
    return response.data || [];
  }

  /**
   * Obtiene el detalle de un trabajador por su identificador.
   */
  public async getWorkerById(id: string): Promise<IWorker> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<IWorker>>(`${this.endpoint}/${id}`)
    );
    return response.data;
  }

  /**
   * Registra un nuevo colaborador administrativo con asignación de cargo.
   */
  public async createWorker(payload: ICreateWorkerRequestDto): Promise<IWorker> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<IWorker>>(this.endpoint, payload)
    );
    return response.data;
  }

  /**
   * Actualiza el cargo o datos de contacto de un trabajador administrativo.
   */
  public async updateWorker(id: string, payload: IUpdateWorkerRequestDto): Promise<IWorker> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<IWorker>>(`${this.endpoint}/${id}`, payload)
    );
    return response.data;
  }

  /**
   * Alterna el estado activo/inactivo (baja lógica) de un trabajador.
   */
  public async toggleWorkerStatus(id: string): Promise<IWorker> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<IWorker>>(`${this.endpoint}/${id}/toggle`, {})
    );
    return response.data;
  }
}
