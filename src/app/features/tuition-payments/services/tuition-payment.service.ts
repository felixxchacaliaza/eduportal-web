import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ApiResponse } from '../../../core/api/models/interfaces/api-response.interface';
import {
  ITuitionPayment,
  ITuitionKpi,
  IPayTuitionRequest,
} from '../models';

/**
 * ============================================================================
 * TuitionPaymentService
 * ============================================================================
 * Servicio reactivo para la administración del cronograma de pagos,
 * cálculo de amortizaciones e indicadores clave de cobranza escolar (KPIs).
 *
 * Arquitectura:
 * - Angular 22 Zoneless nativo con Signals reactivos
 * - 1 Clase = 1 Archivo
 * ============================================================================
 */
@Injectable({
  providedIn: 'root',
})
export class TuitionPaymentService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.tuitionPayments;
  private readonly kpisEndpoint = API_ENDPOINTS.tuitionPaymentsKpis;

  /** Estado de carga global del módulo */
  public readonly loading = signal<boolean>(false);

  /** Lista reactiva de cuotas anuales */
  public readonly payments = signal<ITuitionPayment[]>([]);

  /** Resumen de métricas financieras de cobranza */
  public readonly kpis = signal<ITuitionKpi | null>(null);

  /** Filtros reactivos */
  public readonly filterStatus = signal<string>('ALL');
  public readonly filterConcept = signal<string>('ALL');
  public readonly searchTerm = signal<string>('');

  /** Cuotas filtradas reactivamente mediante computed */
  public readonly filteredPayments = computed<ITuitionPayment[]>(() => {
    const list = this.payments();
    const status = this.filterStatus();
    const concept = this.filterConcept();
    const term = this.searchTerm().trim().toLowerCase();

    return list.filter((p) => {
      const matchStatus = status === 'ALL' || p.status === status;
      const matchConcept = concept === 'ALL' || p.concept === concept;

      let matchSearch = true;
      if (term) {
        const studentName = `${p.student?.person?.firstName || ''} ${p.student?.person?.lastName || ''}`.toLowerCase();
        const doc = (p.student?.person?.documentNumber || '').toLowerCase();
        const code = (p.code || '').toLowerCase();
        matchSearch = studentName.includes(term) || doc.includes(term) || code.includes(term);
      }

      return matchStatus && matchConcept && matchSearch;
    });
  });

  /**
   * Obtiene la lista de pagos desde el backend.
   */
  public async loadPayments(filter?: { status?: string; academicYear?: string; concept?: string }): Promise<ITuitionPayment[]> {
    this.loading.set(true);
    try {
      let params = new HttpParams();
      if (filter?.status && filter.status !== 'ALL') params = params.set('status', filter.status);
      if (filter?.academicYear) params = params.set('academicYear', filter.academicYear);
      if (filter?.concept && filter.concept !== 'ALL') params = params.set('concept', filter.concept);

      const response = await firstValueFrom(
        this.http.get<ApiResponse<ITuitionPayment[]>>(this.endpoint, { params })
      );

      const data = response.data || [];
      this.payments.set(data);
      return data;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Obtiene el resumen de KPIs financieros.
   */
  public async loadKpis(academicYear?: string): Promise<ITuitionKpi | null> {
    try {
      let params = new HttpParams();
      if (academicYear) params = params.set('academicYear', academicYear);

      const response = await firstValueFrom(
        this.http.get<ApiResponse<ITuitionKpi>>(this.kpisEndpoint, { params })
      );

      const kpiData = response.data || null;
      this.kpis.set(kpiData);
      return kpiData;
    } catch {
      return null;
    }
  }

  /**
   * Registra el pago / amortización de una cuota escolar.
   */
  public async registerPayment(id: string, payload: IPayTuitionRequest): Promise<ITuitionPayment> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<ITuitionPayment>>(`${this.endpoint}/pay/${id}`, payload)
      );

      // Actualizar estado local reactivo
      const updated = response.data;
      this.payments.update((list) =>
        list.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );

      // Recalcular KPIs
      await this.loadKpis();

      return updated;
    } finally {
      this.loading.set(false);
    }
  }
}
