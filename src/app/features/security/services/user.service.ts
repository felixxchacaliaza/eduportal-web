import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/models/interfaces/api-response.interface';
import { User, SaveUserDto } from '../models';

/**
 * ============================================================================
 * UserService
 * ============================================================================
 * Servicio reactivo para la administración del catálogo de usuarios.
 * Consume `/api/users` y gestiona el estado local mediante Angular Signals.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.users;

  /** Estado reactivo de la lista de usuarios */
  public readonly users = signal<readonly User[]>([]);

  /** Indicador reactivo de operaciones asíncronas en progreso */
  public readonly isLoading = signal<boolean>(false);

  /**
   * Carga la totalidad de usuarios desde la API.
   */
  public async loadAll(): Promise<User[]> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<User[]>>(this.endpoint)
      );
      const data = response.data || [];
      this.users.set(data);
      return data;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Crea una nueva cuenta de usuario en el sistema.
   */
  public async create(dto: SaveUserDto): Promise<User> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<User>>(this.endpoint, dto)
      );
      await this.loadAll();
      return response.data;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Actualiza los datos de un usuario existente.
   */
  public async update(id: string, dto: Partial<SaveUserDto>): Promise<User> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse<User>>(`${this.endpoint}/${id}`, dto)
      );
      await this.loadAll();
      return response.data;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Alterna el estado activo/inactivo de una cuenta (con salvaguarda RN-SEG-02).
   */
  public async toggle(id: string): Promise<User> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.patch<ApiResponse<User>>(`${this.endpoint}/${id}/toggle`, {})
      );
      await this.loadAll();
      return response.data;
    } finally {
      this.isLoading.set(false);
    }
  }
}
