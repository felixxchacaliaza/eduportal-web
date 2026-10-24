import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Rule } from '../models/interfaces/rule.interface';

/**
 * ============================================================================
 * RuleService (Infraestructura HTTP)
 * ============================================================================
 * Servicio para consultar las reglas de configuración institucional en MongoDB.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. Promesas con `firstValueFrom`:
 *    - Reemplazo moderno y estándar de `.toPromise()` en RxJS 7+.
 * 2. Fallback Defensivo en `getShifts`:
 *    - Si el backend o la base de datos no tienen configurada la regla 'SHIFTS',
 *      el método captura el error y retorna un fallback predeterminado para
 *      evitar que la UI quede en blanco.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root',
})
export class RuleService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.rules;

  /**
   * Obtiene la lista completa de reglas del colegio, opcionalmente filtrada por año.
   */
  public async getRules(year?: string): Promise<Rule[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year);
    }
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Rule[]>>(this.endpoint, { params })
    );
    return res.data;
  }

  /**
   * Obtiene una regla específica por su clave de negocio (ej. 'SHIFTS') o ID.
   */
  public async getRuleByKeyOrId(keyOrId: string, year?: string): Promise<Rule> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year);
    }
    const res = await firstValueFrom(
      this.http.get<ApiResponse<Rule>>(`${this.endpoint}/${keyOrId}`, { params })
    );
    return res.data;
  }

  /**
   * Obtiene los turnos escolares válidos para el año escolar especificado.
   * Resuelve automáticamente si el valor viene en `currentValue` o en la matriz `value`.
   */
  public async getShifts(year: string = '2026'): Promise<string[]> {
    try {
      const rule = await this.getRuleByKeyOrId('SHIFTS', year);
      if (Array.isArray(rule.currentValue)) {
        return rule.currentValue;
      }
      if (Array.isArray(rule.value)) {
        const item = rule.value.find((v: any) => String(v.year) === String(year));
        if (item && Array.isArray(item.value)) {
          return item.value;
        }
      }
      return ['MAÑANA', 'TARDE'];
    } catch (error) {
      console.warn('No se pudo cargar la regla SHIFTS del backend, usando fallback:', error);
      return ['MAÑANA', 'TARDE'];
    }
  }
}
