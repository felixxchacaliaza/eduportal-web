import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Level } from '../models/interfaces/level.interface';

/**
 * ============================================================================
 * LevelService (Core API Service)
 * ============================================================================
 * Servicio HTTP para la gestión de Niveles Educativos (Colección `levels`).
 * Permite listar, consultar por ID, registrar y editar niveles educativos.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.levels;

  /**
   * Obtiene todos los niveles educativos ordenados por código.
   */
  public async getLevels(): Promise<Level[]> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Level[]>>(this.endpoint)
    );
    return res.data;
  }

  /**
   * Obtiene un nivel educativo por su ID o código.
   */
  public async getLevelById(id: string): Promise<Level> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Level>>(`${this.endpoint}/${id}`)
    );
    return res.data;
  }

  /**
   * Registra un nuevo nivel educativo. El código se autogenera si se omite.
   */
  public async createLevel(payload: Partial<Level>): Promise<Level> {
    const res = await firstValueFrom(
      this.http.post<ApiResponse<Level>>(this.endpoint, payload)
    );
    return res.data;
  }

  /**
   * Actualiza los datos o el estado de habilitación de un nivel educativo.
   */
  public async updateLevel(id: string, payload: Partial<Level>): Promise<Level> {
    const res = await firstValueFrom(
      this.http.put<ApiResponse<Level>>(`${this.endpoint}/${id}`, payload)
    );
    return res.data;
  }
}
