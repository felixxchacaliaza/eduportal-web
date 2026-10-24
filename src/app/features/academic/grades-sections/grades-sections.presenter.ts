import { Injectable, computed, inject, signal } from '@angular/core';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';
import { Grade, GradeSection, GradeSectionService, GradeService } from '../../../core/api';
import { GradeSectionItem } from './models/interfaces/grade-section-item.interface';
import { GradesSectionsFilterState } from './models/interfaces/grades-sections-filter-state.interface';

/**
 * ============================================================================
 * GradesSectionsPresenter (View Presenter)
 * ============================================================================
 * Presentador maestro del catálogo de Grados y Secciones (Single Source of Truth).
 *
 * @remarks
 * Encapsula de forma estricta:
 * 1. Consumo HTTP hacia la API (`GradeSectionService`, `GradeService`).
 * 2. Mantenimiento del estado reactivo mediante Signals (`gradeSections`, `grades`, `filterState`).
 * 3. Cálculos derivados con `computed()` (`cards`, `filteredSections`).
 * 4. Mutaciones de negocio (actualizaciones optimistas con rollback).
 *
 * NOTA DE ARQUITECTURA:
 * No inyecta `MatDialog` ni manipula el DOM de Angular Material. La apertura de
 * modales y la interacción visual corresponden al Componente contenedor.
 * ============================================================================
 */
@Injectable()
export class GradesSectionsPresenter {
  private readonly gradeSectionService = inject(GradeSectionService);
  private readonly gradeService = inject(GradeService);

  // --------------------------------------------------------------------------
  // Signals de Estado
  // --------------------------------------------------------------------------
  public readonly gradeSections = signal<readonly GradeSectionItem[]>([]);
  public readonly grades = signal<readonly Grade[]>([]);
  public readonly filterState = signal<GradesSectionsFilterState>({
    gradeId: 'ALL',
    status: 'ALL',
    search: '',
  });

  public readonly isLoading = signal<boolean>(false);

  constructor() {
    this.init();
  }

  public async init(): Promise<void> {
    this.isLoading.set(true);
    await Promise.all([this.loadGrades(), this.loadGradeSections()]);
    this.isLoading.set(false);
  }

  public async loadGrades(): Promise<void> {
    try {
      const grades = await this.gradeService.getGrades();
      this.grades.set(grades.filter(g => g.enabled));
    } catch (error) {
      console.error('Error al cargar grados escolares:', error);
    }
  }

  public async loadGradeSections(): Promise<void> {
    try {
      const data = await this.gradeSectionService.getGradeSections({ academicYear: '2026' });
      const mapped = data.map(item => this.mapGradeSectionToItem(item));
      this.gradeSections.set(mapped);
    } catch (error) {
      console.error('Error al cargar secciones por grado:', error);
    }
  }

  // --------------------------------------------------------------------------
  // Computeds Reactivos
  // --------------------------------------------------------------------------

  public readonly filteredSections = computed<readonly GradeSectionItem[]>(() => {
    const list = this.gradeSections();
    const { gradeId, status, search } = this.filterState();
    const query = search.trim().toLowerCase();

    return list.filter(item => {
      const matchGrade = gradeId === 'ALL' || item.gradeId === gradeId;
      const matchStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && item.status === 'Activa') ||
        (status === 'INACTIVE' && item.status === 'Desactiva');

      const matchSearch =
        !query ||
        item.sectionName.toLowerCase().includes(query) ||
        item.classroomName.toLowerCase().includes(query) ||
        item.gradeName.toLowerCase().includes(query);

      return matchGrade && matchStatus && matchSearch;
    });
  });

  public readonly cards = computed<readonly InfoCardData[]>(() => {
    const all = this.gradeSections();
    const active = all.filter(s => s.status === 'Activa');
    const inactive = all.filter(s => s.status !== 'Activa');

    const totalCapacity = all.reduce((acc, curr) => acc + curr.maxCapacity, 0);

    return [
      {
        label: 'Total Secciones Registradas',
        value: all.length,
        subtitle: 'Secundaria (1° a 5°)',
        color: 'blue',
      },
      {
        label: 'Secciones Activas',
        value: active.length,
        subtitle: 'Aperturadas para el periodo',
        color: 'green',
      },
      {
        label: 'Secciones Desactivas',
        value: inactive.length,
        subtitle: 'Historial protegido sin borrado',
        color: 'amber',
      },
      {
        label: 'Capacidad Escolar Total',
        value: `${totalCapacity} alumnos`,
        subtitle: 'Aforo total en aulas físicas',
        color: 'blue',
      },
    ];
  });

  // --------------------------------------------------------------------------
  // Acciones y Mutaciones de Estado
  // --------------------------------------------------------------------------

  /**
   * Actualiza el estado reactivo de los filtros aplicados por el usuario.
   * Al mutar la Signal `filterState`, el `computed()` `filteredSections` se
   * recalcula automáticamente en el siguiente tick de microtarea.
   */
  public applyFilters(state: GradesSectionsFilterState): void {
    this.filterState.set(state);
  }

  /**
   * Alterna el estado operativo (Activa / Desactiva) aplicando una actualización
   * optimista inmediata en la UI con rollback defensivo ante fallos de red.
   *
   * @param id - Identificador único de la sección a modificar.
   */
  public async toggleSectionStatus(id: string): Promise<void> {
    const target = this.gradeSections().find(s => s.id === id);
    if (!target) return;

    const previousStatus = target.status;
    const newStatus = previousStatus === 'Activa' ? 'Desactiva' : 'Activa';

    // 1. Mutación optimista inmediata en la Signal para UX a 60 fps
    this.gradeSections.update(list =>
      list.map(s => (s.id === id ? { ...s, status: newStatus } : s))
    );

    try {
      // 2. Persistencia en la base de datos vía HTTP
      await this.gradeSectionService.updateGradeSection(id, {
        enabled: newStatus === 'Activa',
      });
    } catch (error) {
      console.error('Error al actualizar estado de la sección:', error);
      // 3. Rollback automático: si la API falla, revertimos el estado al valor anterior
      this.gradeSections.update(list =>
        list.map(s => (s.id === id ? { ...s, status: previousStatus } : s))
      );
    }
  }

  // --------------------------------------------------------------------------
  // Métodos Auxiliares de Mapeo
  // --------------------------------------------------------------------------

  /**
   * Transforma la entidad relacional poblada de MongoDB (`GradeSection`)
   * hacia el modelo plano optimizado para la tabla (`GradeSectionItem`).
   */
  private mapGradeSectionToItem(item: GradeSection): GradeSectionItem {
    const gradeObj = typeof item.grade === 'object' ? item.grade : null;
    const sectionObj = typeof item.section === 'object' ? item.section : null;
    const classroomObj = typeof item.classroom === 'object' ? item.classroom : null;

    const gradeId = gradeObj?.id || (item.grade as any)?._id || (item.grade as string);
    const gradeName = gradeObj?.description || (gradeObj?.name ? `${gradeObj.name}° Secundaria` : 'Secundaria');

    const sectionId = sectionObj?.id || (item.section as any)?._id || (item.section as string);
    const sectionName = sectionObj?.name || 'Sección';

    const classroomId = classroomObj?.id || (item.classroom as any)?._id || (typeof item.classroom === 'string' ? item.classroom : '');
    const classroomName = classroomObj?.name || 'Sin Aula Asignada';

    const maxCapacity = classroomObj?.capacity ?? item.maxCapacity ?? 30;

    return {
      id: item.id || (item as any)._id,
      code: item.code,
      gradeId,
      gradeName,
      sectionId,
      sectionName,
      classroomId,
      classroomName,
      shift: item.shift || 'MAÑANA',
      maxCapacity,
      status: item.enabled ? 'Activa' : 'Desactiva',
    };
  }
}
