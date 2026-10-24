import { Injectable, computed, inject, signal } from '@angular/core';
import { Level, LevelService } from '../../../core/api';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';

export interface LevelsFilterState {
  readonly search: string;
  readonly status: 'ALL' | 'ACTIVE' | 'INACTIVE';
}

/**
 * ============================================================================
 * LevelsPresenter (View Presenter / Headless UI State)
 * ============================================================================
 * Administra el estado reactivo, filtrado y operaciones de negocio para
 * el catálogo de Niveles Educativos (Inicial, Primaria, Secundaria).
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS CLAVE:
 * 1. Single Source of Truth:
 *    - La Signal `levels` almacena la lista inmutable cargada desde MongoDB.
 * 2. Derivación Declarativa con `computed()`:
 *    - `filteredLevels`: Recalcula el subconjunto visible en memoria a 60 fps
 *      cada vez que el buscador `search` o el estado `status` cambian.
 *    - `cards`: Calcula automáticamente los contadores de niveles activos,
 *      inactivos y totales sin requerir endpoints adicionales.
 * 3. Actualización Optimista con Rollback:
 *    - Al alternar el estado (habilitar/deshabilitar), la UI responde en 0ms
 *      mutando la Signal localmente. Si la petición HTTP falla, el bloque
 *      `catch` revierte la Signal a su valor anterior sin dejar la vista inconsistente.
 * 4. Desacoplamiento de la Vista:
 *    - No importa `MatDialog` ni interactúa con el DOM, lo que permite
 *      realizar pruebas unitarias puras y aisladas.
 * ============================================================================
 */
@Injectable()
export class LevelsPresenter {
  private readonly levelService = inject(LevelService);

  // Signals de Estado
  public readonly levels = signal<readonly Level[]>([]);
  public readonly filterState = signal<LevelsFilterState>({
    search: '',
    status: 'ALL',
  });
  public readonly isLoading = signal<boolean>(false);

  constructor() {
    this.loadLevels();
  }

  public async loadLevels(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.levelService.getLevels();
      this.levels.set(data);
    } catch (error) {
      console.error('Error al cargar niveles educativos:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Filtrado reactivo en memoria
  public readonly filteredLevels = computed<readonly Level[]>(() => {
    const list = this.levels();
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

  // Tarjetas métricas estadísticas
  public readonly cards = computed<readonly InfoCardData[]>(() => {
    const all = this.levels();
    const active = all.filter(l => l.enabled);
    const inactive = all.filter(l => !l.enabled);

    return [
      {
        label: 'Total Niveles Registrados',
        value: all.length,
        subtitle: 'Educación Básica Regular',
        color: 'blue',
      },
      {
        label: 'Niveles Activos',
        value: active.length,
        subtitle: 'Habilitados para matrículas',
        color: 'green',
      },
      {
        label: 'Niveles Inactivos',
        value: inactive.length,
        subtitle: 'Histórico protegido',
        color: 'amber',
      },
    ];
  });

  public applyFilters(state: LevelsFilterState): void {
    this.filterState.set(state);
  }

  /**
   * Alterna el estado activo/inactivo con actualización optimista inmediata
   * y rollback defensivo en caso de error de red.
   */
  public async toggleLevelStatus(id: string): Promise<void> {
    const target = this.levels().find(l => l.id === id);
    if (!target) return;

    const previousEnabled = target.enabled;
    const newEnabled = !previousEnabled;

    // 1. Actualización optimista en la Signal
    this.levels.update(list =>
      list.map(l => (l.id === id ? { ...l, enabled: newEnabled } : l))
    );

    try {
      // 2. Persistencia en la API
      await this.levelService.updateLevel(id, { enabled: newEnabled });
    } catch (error) {
      console.error('Error al actualizar estado del nivel:', error);
      // 3. Rollback
      this.levels.update(list =>
        list.map(l => (l.id === id ? { ...l, enabled: previousEnabled } : l))
      );
    }
  }
}
