import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/models/interfaces/api-response.interface';
import { IPerson, ICheckDniResponse } from '../models';

/**
 * ============================================================================
 * PersonService
 * ============================================================================
 * Servicio HTTP para la consulta y validación del Padrón Civil Universal.
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
   * Valida en tiempo real si un DNI ya existe en el padrón civil o es estudiante.
   */
  public async checkDni(dni: string): Promise<ICheckDniResponse> {
    const cleanDni = dni.trim();
    if (!/^\d{8}$/.test(cleanDni)) {
      return { exists: false, isStudent: false };
    }

    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<ICheckDniResponse>>(`${this.endpoint}/check-dni/${cleanDni}`)
      );
      return response.data || { exists: false, isStudent: false };
    } catch {
      return { exists: false, isStudent: false };
    }
  }

  /**
   * Busca los datos de una persona por su DNI exacto.
   */
  public async getPersonByDni(dni: string): Promise<IPerson | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<IPerson[]>>(`${this.endpoint}?search=${dni.trim()}`)
      );
      const list = response.data || [];
      return list.find(p => p.dni === dni.trim()) || null;
    } catch {
      return null;
    }
  }
}
