import { Injectable, computed, inject, signal } from '@angular/core';
import { Area, AreaService } from '../../../core/api';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';

export interface AreasFilterState {
  readonly search: string;
  readonly status: 'ALL' | 'ACTIVE' | 'INACTIVE';
}

/**
 * ============================================================================
 * AreasPresenter (View Presenter / Headless UI State)
 * ============================================================================
 * Administra el estado reactivo, filtrado y operaciones de negocio para
 * el catálogo de Áreas Curriculares (Matemática, Comunicación, Ciencias, etc.).
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS CLAVE:
 * 1. Single Source of Truth:
 *    - La Signal `areas` gobierna el catálogo de áreas cargado desde MongoDB.
 * 2. Computeds de Alto Rendimiento:
 *    - `filteredAreas`: Filtra la lista en memoria en 0ms cuando el usuario escribe.
 *    - `cards`: Calcula en tiempo real las métricas (Total, Activas, Inactivas).
 * 3. Actualización Optimista con Rollback:
 *    - Al cambiar el estado de un área, la Signal se actualiza antes de la llamada HTTP.
 *    - Si la conexión falla, se revierte automáticamente (`rollback`) al valor anterior.
 * 4. Desacoplamiento Arquitectural:
 *    - Presenter 100% libre de dependencias de Angular Material o del DOM.
 * ============================================================================
 */
@Injectable()
export class AreasPresenter {
  private readonly areaService = inject(AreaService);

  public readonly areas = signal<readonly Area[]>([]);
  public readonly filterState = signal<AreasFilterState>({
    search: '',
    status: 'ALL',
  });
  public readonly isLoading = signal<boolean>(false);

  constructor() {
    this.loadAreas();
  }

  public async loadAreas(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.areaService.getAreas();
      this.areas.set(data);
    } catch (error) {
      console.error('Error al cargar áreas curriculares:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  public readonly filteredAreas = computed<readonly Area[]>(() => {
    const list = this.areas();
    const { search, status } = this.filterState();
    const query = search.trim().toLowerCase();

    return list.filter(item => {
      const matchStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && item.enabled) ||
        (status === 'INACTIVE' && !item.enabled);

      const matchSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));

      return matchStatus && matchSearch;
    });
  });

  public readonly cards = computed<readonly InfoCardData[]>(() => {
    const all = this.areas();
    const active = all.filter(a => a.enabled);
    const inactive = all.filter(a => !a.enabled);

    return [
      {
        label: 'Total Áreas Registradas',
        value: all.length,
        subtitle: 'Malla MINEDU y Talleres',
        color: 'blue',
      },
      {
        label: 'Áreas Activas',
        value: active.length,
        subtitle: 'Vigentes para asignación',
        color: 'green',
      },
      {
        label: 'Áreas Inactivas',
        value: inactive.length,
        subtitle: 'Histórico protegido',
        color: 'amber',
      },
    ];
  });

  public applyFilters(state: AreasFilterState): void {
    this.filterState.set(state);
  }

  public async toggleAreaStatus(id: string): Promise<void> {
    const target = this.areas().find(a => a.id === id);
    if (!target) return;

    const previousEnabled = target.enabled;
    const newEnabled = !previousEnabled;

    // Actualización optimista
    this.areas.update(list =>
      list.map(a => (a.id === id ? { ...a, enabled: newEnabled } : a))
    );

    try {
      await this.areaService.updateArea(id, { enabled: newEnabled });
    } catch (error) {
      console.error('Error al actualizar estado del área:', error);
      // Rollback
      this.areas.update(list =>
        list.map(a => (a.id === id ? { ...a, enabled: previousEnabled } : a))
      );
    }
  }
}
