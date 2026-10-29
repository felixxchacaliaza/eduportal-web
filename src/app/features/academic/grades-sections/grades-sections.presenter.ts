import { Injectable, computed, inject, signal } from '@angular/core';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';
import { Grade, GradeSection, GradeSectionService, GradeService } from '../../../core/api';
import { GradeSectionItem } from './models/interfaces/grade-section-item.interface';
import { GradesSectionsFilterState } from './models/interfaces/grades-sections-filter-state.interface';

@Injectable()
export class GradesSectionsPresenter {
  private readonly gradeSectionService = inject(GradeSectionService);
  private readonly gradeService = inject(GradeService);

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
    } catch (e) {
      console.error(e);
    }
  }

  public async loadGradeSections(): Promise<void> {
    try {
      const data = await this.gradeSectionService.getGradeSections({ academicYear: '2026' });
      this.gradeSections.set(data.map(item => this.mapGradeSectionToItem(item)));
    } catch (e) {
      console.error(e);
    }
  }

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
      { label: 'Total Secciones Registradas', value: all.length, subtitle: 'Secundaria (1° a 5°)', color: 'blue' },
      { label: 'Secciones Activas', value: active.length, subtitle: 'Aperturadas para el periodo', color: 'green' },
      { label: 'Secciones Desactivas', value: inactive.length, subtitle: 'Historial protegido sin borrado', color: 'amber' },
      { label: 'Capacidad Escolar Total', value: `${totalCapacity} alumnos`, subtitle: 'Aforo total en aulas físicas', color: 'blue' },
    ];
  });

  public applyFilters(state: GradesSectionsFilterState): void {
    this.filterState.set(state);
  }

  public async toggleSectionStatus(id: string): Promise<void> {
    const target = this.gradeSections().find(s => s.id === id);
    if (!target) return;

    const previousStatus = target.status;
    const newStatus = previousStatus === 'Activa' ? 'Desactiva' : 'Activa';

    this.gradeSections.update(list => list.map(s => (s.id === id ? { ...s, status: newStatus } : s)));

    try {
      await this.gradeSectionService.updateGradeSection(id, { enabled: newStatus === 'Activa' });
    } catch {
      this.gradeSections.update(list => list.map(s => (s.id === id ? { ...s, status: previousStatus } : s)));
    }
  }

  private mapGradeSectionToItem(item: GradeSection): GradeSectionItem {
    const gradeObj = typeof item.grade === 'object' ? item.grade : null;
    const sectionObj = typeof item.section === 'object' ? item.section : null;
    const classroomObj = typeof item.classroom === 'object' ? item.classroom : null;

    return {
      id: item.id || (item as any)._id,
      code: item.code,
      gradeId: gradeObj?.id || (item.grade as any)?._id || (item.grade as string),
      gradeName: gradeObj?.description || (gradeObj?.name ? `${gradeObj.name}° Secundaria` : 'Secundaria'),
      sectionId: sectionObj?.id || (item.section as any)?._id || (item.section as string),
      sectionName: sectionObj?.name || 'Sección',
      classroomId: classroomObj?.id || (item.classroom as any)?._id || (typeof item.classroom === 'string' ? item.classroom : ''),
      classroomName: classroomObj?.name || 'Sin Aula Asignada',
      shift: item.shift || 'MAÑANA',
      maxCapacity: classroomObj?.capacity ?? item.maxCapacity ?? 30,
      status: item.enabled ? 'Activa' : 'Desactiva',
    };
  }
}