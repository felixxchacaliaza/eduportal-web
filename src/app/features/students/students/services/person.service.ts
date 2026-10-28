import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import { IPerson, ICheckDniResponse } from '../models';

/**
 * ============================================================================
 * PersonService
 * ============================================================================
 * Servicio HTTP para la consulta civil de personas y validación de DNI.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.persons;

  /**
   * Consulta si un DNI ya existe en el padrón civil y si ya es estudiante.
   */
  public async checkDni(dni: string): Promise<ICheckDniResponse> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<ICheckDniResponse>>(`${this.endpoint}/check-dni/${dni.trim()}`)
      );
      return response.data;
    } catch {
      return {
        exists: false,
        isStudent: false
      };
    }
  }

  /**
   * Obtiene los datos civiles de una persona por su número de DNI.
   */
  public async getPersonByDni(dni: string): Promise<IPerson | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<IPerson[]>>(`${this.endpoint}?dni=${dni.trim()}`)
      );
      const list = response.data || [];
      return list.find((p: IPerson) => p.dni === dni.trim()) || null;
    } catch {
      return null;
    }
  }
}
