import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/models/interfaces/api-response.interface';
import { Profile, SaveProfileDto } from '../models';

/**
 * ============================================================================
 * ProfileService
 * ============================================================================
 * Servicio reactivo para la administración del catálogo de perfiles y permisos RBAC.
 * Consume `/api/profiles` y gestiona el estado local mediante Angular Signals.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.profiles;

  /** Estado reactivo de la lista de perfiles */
  public readonly profiles = signal<readonly Profile[]>([]);

  /** Indicador reactivo de operaciones asíncronas en progreso */
  public readonly isLoading = signal<boolean>(false);

  /**
   * Carga la totalidad de perfiles desde la API.
   */
  public async loadAll(): Promise<Profile[]> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<Profile[]>>(this.endpoint)
      );
      const data = response.data || [];
      this.profiles.set(data);
      return data;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Registra un nuevo perfil institucional con su matriz de permisos.
   */
  public async create(dto: SaveProfileDto): Promise<Profile> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<Profile>>(this.endpoint, dto)
      );
      await this.loadAll();
      return response.data;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Actualiza los datos y matriz de permisos de un perfil existente.
   */
  public async update(id: string, dto: Partial<SaveProfileDto>): Promise<Profile> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse<Profile>>(`${this.endpoint}/${id}`, dto)
      );
      await this.loadAll();
      return response.data;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Alterna el estado activo/inactivo de un perfil (con salvaguarda para SuperAdmin).
   */
  public async toggle(id: string): Promise<Profile> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.patch<ApiResponse<Profile>>(`${this.endpoint}/${id}/toggle`, {})
      );
      await this.loadAll();
      return response.data;
    } finally {
      this.isLoading.set(false);
    }
  }
}
