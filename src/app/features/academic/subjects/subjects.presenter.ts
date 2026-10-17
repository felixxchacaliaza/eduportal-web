import { Injectable, computed, inject, signal } from '@angular/core';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';
import { AreaService, Subject, SubjectService } from '../../../core/api';
import { FilterOption } from './components/subjects-filters/models/interfaces/filter-option.interface';
import { SubjectsFilterState } from './components/subjects-filters/models/interfaces/subjects-filter-state.interface';
import { SubjectsSaveFormPayload } from './dialogs/subjects-save-dialog/models/interfaces/subjects-save-form-payload.interface';

/**
 * ============================================================================
 * SubjectItem Interface
 * ============================================================================
 * Modelo de vista (ViewModel) para la representación de una asignatura en la UI.
 *
 * @remarks
 * Transforma el contrato crudo de la API (entidad {@link Subject}) agregando
 * propiedades visuales derivadas como íconos temáticos y paleta cromática según el área.
 * ============================================================================
 */
export interface SubjectItem {
  /** Identificador único UUID de la asignatura */
  readonly id: string;

  /** Código académico de la asignatura (ej. 'MAT-01', 'COM-02') */
  readonly code: string;

  /** Nombre formal de la materia */
  readonly name: string;

  /** Descripción u observaciones pedagógicas de la asignatura */
  readonly description?: string;

  /** Nombre del área curricular pedagógica asociada */
  readonly area: string;

  /** Identificador único (ObjectId) del área curricular asociada */
  readonly areaId: string;

  /** Carga lectiva semanal en horas pedagógicas */
  readonly hours: number;

  /** Estado operativo textual formateado para presentación ('Activa' | 'Desactiva') */
  readonly status: 'Activa' | 'Desactiva';

  /** Emoji o identificador de icono asociado a la especialidad */
  readonly icon: string;

  /** Color hexadecimal distintivo para avatares y etiquetas */
  readonly color: string;
}

/**
 * ============================================================================
 * SubjectsPresenter (View Presenter)
 * ============================================================================
 * Presentador maestro del catálogo académico de asignaturas (Single Source of Truth).
 *
 * @remarks
 * Actúa como el **View Presenter** de la vista principal del módulo de asignaturas:
 * 1. **Consumo HTTP:** Consulta asignaturas (`GET /api/subjects`) y áreas (`GET /api/areas`).
 * 2. **Estado Reactivo:** Mantiene las Signals del catálogo maestro (`subjects`) y filtros (`filters`).
 * 3. **Cálculos Derivados:** Computa reactivamente las tarjetas métricas (`cards`) y la lista filtrada (`filteredSubjects`).
 * 4. **Mutaciones:** Provee métodos para alternar estados operativos y recargar la colección tras persistencias.
 * ============================================================================
 */
@Injectable()
export class SubjectsPresenter {
  private readonly subjectService = inject(SubjectService);
  private readonly areaService = inject(AreaService);

  /** Catálogo maestro de asignaturas */
  public readonly subjects = signal<readonly SubjectItem[]>([]);

  /** Opciones de áreas curriculares para el componente de filtros */
  public readonly areas = signal<readonly FilterOption[]>([]);

  /** Estado actual de filtros aplicados */
  public readonly filters = signal<SubjectsFilterState>({
    area: 'ALL',
    status: 'ALL',
    search: '',
  });

  constructor() {
    this.loadSubjects();
    this.loadAreas();
  }

  /**
   * Consulta todas las asignaturas al Backend con async / await:
   * GET /api/subjects (port 3001)
   */
  public async loadSubjects(): Promise<void> {
    try {
      const subjects = await this.subjectService.getSubjects();
      const mapped = subjects.map(item => this.mapSubjectToItem(item));
      this.subjects.set(mapped);
    } catch (error) {
      console.error('Error al cargar asignaturas desde el backend:', error);
    }
  }

  /**
   * Consulta las áreas curriculares activas al Backend con async / await:
   * GET /api/areas (port 3001)
   */
  public async loadAreas(): Promise<void> {
    try {
      const areas = await this.areaService.getAreas();
      const options: FilterOption[] = [
        { label: 'Todas las Áreas', value: 'ALL' },
        ...areas
          .filter(area => area.enabled)
          .map(area => ({
            label: area.name.charAt(0).toUpperCase() + area.name.slice(1).toLowerCase(),
            value: (area as any).id || (area as any)._id || area.name,
          })),
      ];
      this.areas.set(options);
    } catch (error) {
      console.error('Error al cargar áreas curriculares desde el backend:', error);
    }
  }

  /**
   * Aplica los filtros consolidados provenientes del componente de filtros.
   *
   * @param filters - Estado con área, estado y texto de búsqueda.
   */
  public applyFilters(filters: SubjectsFilterState): void {
    this.filters.set(filters);
  }

  /**
   * Alterna el estado operativo de una asignatura (Activa <-> Desactiva)
   * y persiste el cambio inmediatamente en MongoDB.
   *
   * @remarks
   * Emplea actualización optimista para respuesta instantánea en la interfaz,
   * revirtiendo el estado en memoria en caso de error de red.
   */
  public async toggleSubjectStatus(id: string): Promise<void> {
    const subject = this.subjects().find(item => item.id === id);
    if (!subject) return;

    const previousStatus = subject.status;
    const nextEnabled = previousStatus !== 'Activa';

    // 1. Actualización optimista en memoria
    this.subjects.update(items =>
      items.map(item =>
        item.id === id
          ? {
              ...item,
              status: nextEnabled ? 'Activa' : 'Desactiva',
            }
          : item
      )
    );

    // 2. Persistencia en la base de datos (MongoDB) vía PUT /api/subjects/:id
    try {
      await this.subjectService.updateSubject(id, { enabled: nextEnabled });
    } catch (error) {
      console.error('Error al actualizar estado operativo en MongoDB:', error);
      // Reversión del estado en caso de error
      this.subjects.update(items =>
        items.map(item =>
          item.id === id
            ? {
                ...item,
                status: previousStatus,
              }
            : item
        )
      );
    }
  }

  /**
   * Persiste una nueva asignatura en el Backend y refresca el catálogo.
   */
  public async createSubject(payload: SubjectsSaveFormPayload): Promise<void> {
    try {
      await this.subjectService.createSubject({
        name: payload.name,
        area: payload.area,
        weeklyHours: payload.weeklyHours,
        description: payload.description,
        enabled: payload.enabled,
      });
      await this.loadSubjects();
    } catch (error) {
      console.error('Error al registrar asignatura en el backend:', error);
    }
  }

  /**
   * Modifica una asignatura existente en el Backend y refresca el catálogo.
   */
  public async updateSubject(id: string, payload: SubjectsSaveFormPayload): Promise<void> {
    try {
      await this.subjectService.updateSubject(id, {
        name: payload.name,
        area: payload.area,
        weeklyHours: payload.weeklyHours,
        description: payload.description,
        enabled: payload.enabled,
      });
      await this.loadSubjects();
    } catch (error) {
      console.error('Error al actualizar asignatura en el backend:', error);
    }
  }

  /** Asignaturas filtradas en tiempo real (consumidas por la tabla) */
  public readonly filteredSubjects = computed<readonly SubjectItem[]>(() => {
    const { area, status, search } = this.filters();
    const query = search.trim().toLowerCase();

    return this.subjects().filter(item => {
      const matchArea =
        area === 'ALL' ||
        item.areaId === area ||
        item.area.toLowerCase() === area.toLowerCase();
      const matchStatus =
        status === 'ALL' ||
        item.status.toLowerCase() === status.toLowerCase() ||
        (status.toLowerCase().startsWith('inact') && item.status.toLowerCase().startsWith('desact')) ||
        (status.toLowerCase().startsWith('desact') && item.status.toLowerCase().startsWith('inact'));
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query);

      return matchArea && matchStatus && matchQuery;
    });
  });

  /** Cantidad de asignaturas coincidentes con los filtros activos */
  public readonly filteredCount = computed<number>(() => this.filteredSubjects().length);

  /** Cantidad total de asignaturas registradas en el catálogo maestro */
  public readonly totalCount = computed<number>(() => this.subjects().length);

  /* Métricas dinámicas calculadas desde el catálogo maestro: */
  private readonly _totalAsignaturas = computed(
    () => this.subjects().length
  );
  private readonly _asignaturasActivas = computed(
    () => this.subjects().filter(s => s.status === 'Activa').length
  );
  private readonly _asignaturasDesactivadas = computed(
    () => this.subjects().filter(s => s.status !== 'Activa').length
  );
  private readonly _horasSemanalesTotales = computed(() => {
    const total = this.subjects().reduce((sum, s) => sum + s.hours, 0);
    return `${total} hrs/sem`;
  });

  /* Tarjetas para la parte superior de la página: */
  public readonly cards = computed<InfoCardData[]>(() => [
    {
      label: 'Total Asignaturas de la Malla',
      value: this._totalAsignaturas(),
      subtitle: 'Secundaria (CNEB - MINEDU)',
      color: 'blue',
    },
    {
      label: 'Asignaturas Activas',
      value: this._asignaturasActivas(),
      subtitle: 'Vigentes en el año lectivo',
      color: 'green',
    },
    {
      label: 'Asignaturas Desactivadas',
      value: this._asignaturasDesactivadas(),
      subtitle: 'Historial protegido sin borrado',
      color: 'amber',
    },
    {
      label: 'Horas Semanales Totales',
      value: this._horasSemanalesTotales(),
      subtitle: 'Jornada escolar pedagógica',
      color: 'blue',
    },
  ]);

  private mapSubjectToItem(subject: Subject): SubjectItem {
    const meta = this.getSubjectMetadata(subject.code);
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      description: subject.description ?? '',
      area: subject.area?.name ?? '',
      areaId: (subject.area as any)?.id || (subject.area as any)?._id || '',
      hours: subject.weeklyHours,
      status: subject.enabled ? 'Activa' : 'Desactiva',
      icon: meta.icon,
      color: meta.color,
    };
  }

  private getSubjectMetadata(code: string): { icon: string; color: string } {
    const prefix = code.split('-')[0]?.toUpperCase();
    const map: Record<string, { icon: string; color: string }> = {
      ART: { icon: '🎨', color: '#db2777' },
      COM: { icon: '📖', color: '#059669' },
      CYT: { icon: '🧪', color: '#0891b2' },
      CIE: { icon: '🧪', color: '#0891b2' },
      DPCC: { icon: '⚖️', color: '#7c3aed' },
      EDF: { icon: '⚽', color: '#16a34a' },
      EPT: { icon: '💻', color: '#2563eb' },
      HIS: { icon: '🏛️', color: '#d97706' },
      ING: { icon: '🌍', color: '#6366f1' },
      MAT: { icon: '📐', color: '#2563eb' },
      REL: { icon: '🤝', color: '#0284c7' },
      TUT: { icon: '🌱', color: '#059669' },
    };
    return map[prefix] || { icon: '📚', color: '#475569' };
  }
}
