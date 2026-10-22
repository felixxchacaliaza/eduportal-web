import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AcademicYear,
  AcademicYearService,
  AreaService,
  Grade,
  GradeService,
  GradeSubject,
  GradeSubjectService,
  Subject,
  SubjectService,
} from '../../../core/api';
import { GradeSubjectRow, AssignmentStatus } from './models/interfaces/grade-subject-row.interface';
import { GradeStat } from './models/interfaces/grade-stat.interface';
import { GradeSubjectsFilterState } from './models/interfaces/grade-subjects-filter-state.interface';
import { getSubjectMetadata } from './models/constants/grade-subjects-metadata.constant';

@Injectable()
export class GradeSubjectsPresenter {
  private readonly academicYearService = inject(AcademicYearService);
  private readonly gradeService = inject(GradeService);
  private readonly subjectService = inject(SubjectService);
  private readonly gradeSubjectService = inject(GradeSubjectService);
  private readonly areaService = inject(AreaService);

  // --------------------------------------------------------------------------
  // Signals de Estado
  // --------------------------------------------------------------------------
  public readonly academicYears = signal<readonly AcademicYear[]>([]);
  public readonly selectedYear = signal<string>('2026');
  public readonly grades = signal<readonly Grade[]>([]);
  public readonly selectedGradeId = signal<string>('');
  public readonly catalogSubjects = signal<readonly Subject[]>([]);
  public readonly allYearGradeSubjects = signal<readonly GradeSubject[]>([]);
  public readonly areas = signal<readonly { label: string; value: string }[]>([]);

  public readonly filterState = signal<GradeSubjectsFilterState>({
    year: '2026',
    area: 'ALL',
    assignmentStatus: 'ALL',
    search: '',
  });

  public readonly isLoading = signal<boolean>(false);
  public readonly isOperating = signal<boolean>(false);
  public readonly alertMessage = signal<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  constructor() {
    this.init();
  }

  // --------------------------------------------------------------------------
  // Computeds Reactivos
  // --------------------------------------------------------------------------

  /** Grado escolar actualmente seleccionado */
  public readonly selectedGrade = computed<Grade | undefined>(() => {
    const list = this.grades();
    const id = this.selectedGradeId();
    return list.find(g => g.id === id) || list[0];
  });

  /** Asignaciones del año y grado actual */
  public readonly currentGradeAssignments = computed<readonly GradeSubject[]>(() => {
    const activeGradeId = this.selectedGrade()?.id;
    if (!activeGradeId) return [];

    return this.allYearGradeSubjects().filter(gs => {
      const gId = typeof gs.grade === 'string' ? gs.grade : gs.grade?.id;
      return gId === activeGradeId;
    });
  });

  /**
   * Estadísticas por grado para renderizar las pestañas/botones superiores:
   * "1° Secundaria  12 asignaturas  39h"
   */
  public readonly gradeStats = computed<readonly GradeStat[]>(() => {
    const gradesList = this.grades();
    const assignments = this.allYearGradeSubjects();

    return gradesList.map(grade => {
      const activeAssignments = assignments.filter(gs => {
        const gId = typeof gs.grade === 'string' ? gs.grade : gs.grade?.id;
        return gId === grade.id && gs.enabled;
      });

      const assignedSubjectsCount = activeAssignments.length;
      const totalHours = activeAssignments.reduce((acc, curr) => acc + (curr.weeklyHours || 0), 0);

      return {
        gradeId: grade.id,
        code: grade.code,
        name: grade.name,
        description: grade.description,
        assignedSubjectsCount,
        totalHours,
      };
    });
  });

  /**
   * Filas completas del catálogo cruzadas con las asignaciones del grado seleccionado
   */
  public readonly rows = computed<readonly GradeSubjectRow[]>(() => {
    const catalog = this.catalogSubjects();
    const assignments = this.currentGradeAssignments();

    return catalog.map(subject => {
      const assignment = assignments.find(gs => {
        const sId = typeof gs.subject === 'string' ? gs.subject : gs.subject?.id;
        return sId === subject.id;
      });

      const isAssigned = !!assignment && assignment.enabled;
      let assignmentStatus: AssignmentStatus = 'No asignado';
      if (assignment) {
        assignmentStatus = assignment.enabled ? 'Asignado' : 'Deshabilitado';
      }

      const meta = getSubjectMetadata(subject.code);
      const hours = assignment ? assignment.weeklyHours : subject.weeklyHours;

      return {
        subjectId: subject.id,
        gradeSubjectId: assignment?.id,
        code: subject.code,
        name: subject.name,
        description: subject.description,
        area: subject.area?.name || 'General',
        areaId: (subject.area as any)?.id || (subject.area as any)?._id || '',
        hours,
        operationalStatus: subject.enabled ? 'Activa' : 'Desactiva',
        isAssigned,
        assignmentStatus,
        color: meta.color,
      };
    });
  });

  /** Filas filtradas por área, estado de asignación y término de búsqueda */
  public readonly filteredRows = computed<readonly GradeSubjectRow[]>(() => {
    const { area, assignmentStatus, search } = this.filterState();
    const query = search.trim().toLowerCase();

    return this.rows().filter(row => {
      // Filtro por Área
      const matchArea =
        area === 'ALL' ||
        row.areaId === area ||
        row.area.toLowerCase() === area.toLowerCase();

      // Filtro por Estado de Asignación
      const matchStatus =
        assignmentStatus === 'ALL' ||
        (assignmentStatus === 'ASSIGNED' && row.isAssigned) ||
        (assignmentStatus === 'UNASSIGNED' && !row.isAssigned);

      // Filtro por Búsqueda (nombre o código)
      const matchQuery =
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.code.toLowerCase().includes(query);

      return matchArea && matchStatus && matchQuery;
    });
  });

  /** Conteo de asignaturas seleccionadas/activas para el grado actual */
  public readonly selectedCount = computed<number>(() => {
    return this.rows().filter(r => r.isAssigned).length;
  });

  /** Total de asignaturas registradas en el catálogo */
  public readonly totalCatalogCount = computed<number>(() => {
    return this.rows().length;
  });

  /** Total de horas semanales acumuladas para el grado actual */
  public readonly totalAssignedHours = computed<number>(() => {
    return this.rows()
      .filter(r => r.isAssigned)
      .reduce((sum, r) => sum + r.hours, 0);
  });

  /** Indica si todas las asignaturas del catálogo están asignadas */
  public readonly areAllSelected = computed<boolean>(() => {
    const total = this.totalCatalogCount();
    return total > 0 && this.selectedCount() === total;
  });

  // --------------------------------------------------------------------------
  // Ciclo de Vida y Carga de Datos
  // --------------------------------------------------------------------------

  public async init(): Promise<void> {
    this.isLoading.set(true);
    try {
      await Promise.all([
        this.loadAcademicYears(),
        this.loadGrades(),
        this.loadCatalogSubjects(),
        this.loadAreas(),
      ]);
      await this.loadYearGradeSubjects();
    } catch (error) {
      console.error('Error al inicializar el módulo de Grados-Asignaturas:', error);
      this.showAlert('Error al conectar con la base de datos escolar', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async loadAcademicYears(): Promise<void> {
    try {
      const years = await this.academicYearService.getAcademicYears();
      this.academicYears.set(years);

      const active = years.find(y => y.status === 'ACTIVO');
      const chosenYear = active ? active.year : years[0]?.year || '2026';
      this.selectedYear.set(chosenYear);
      this.filterState.update(s => ({ ...s, year: chosenYear }));
    } catch (err) {
      console.error('Error al cargar años lectivos:', err);
    }
  }

  public async loadGrades(): Promise<void> {
    try {
      const grades = await this.gradeService.getGrades();
      this.grades.set(grades);
      if (grades.length > 0 && !this.selectedGradeId()) {
        this.selectedGradeId.set(grades[0].id);
      }
    } catch (err) {
      console.error('Error al cargar grados escolares:', err);
    }
  }

  public async loadCatalogSubjects(): Promise<void> {
    try {
      const subjects = await this.subjectService.getSubjects();
      this.catalogSubjects.set(subjects);
    } catch (err) {
      console.error('Error al cargar catálogo de asignaturas:', err);
    }
  }

  public async loadAreas(): Promise<void> {
    try {
      const areas = await this.areaService.getAreas();
      this.areas.set([
        { label: 'Todas las Áreas', value: 'ALL' },
        ...areas.filter(a => a.enabled).map(a => ({
          label: a.name.charAt(0).toUpperCase() + a.name.slice(1).toLowerCase(),
          value: (a as any).id || (a as any)._id || a.name,
        })),
      ]);
    } catch (err) {
      console.error('Error al cargar áreas curriculares:', err);
    }
  }

  public async loadYearGradeSubjects(): Promise<void> {
    try {
      const year = this.selectedYear();
      const gradeSubjects = await this.gradeSubjectService.getGradeSubjects({ academicYear: year });
      this.allYearGradeSubjects.set(gradeSubjects);
    } catch (err) {
      console.error('Error al cargar asignaciones de malla curricular:', err);
    }
  }

  // --------------------------------------------------------------------------
  // Interacciones de Usuario
  // --------------------------------------------------------------------------

  public async selectYear(year: string): Promise<void> {
    if (this.selectedYear() === year) return;
    this.selectedYear.set(year);
    this.filterState.update(s => ({ ...s, year }));
    this.isLoading.set(true);
    try {
      await this.loadYearGradeSubjects();
      this.showAlert(`Año lectivo ${year} cargado correctamente`, 'success');
    } catch (err) {
      this.showAlert(`Error al cargar datos del año ${year}`, 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  public selectGrade(gradeId: string): void {
    this.selectedGradeId.set(gradeId);
  }

  public applyFilters(filters: Partial<GradeSubjectsFilterState>): void {
    this.filterState.update(prev => ({ ...prev, ...filters }));
  }

  /**
   * Alterna la asignación (Habilitar / Asignar <-> Quitar / Deshabilitar)
   */
  public async toggleAssignment(row: GradeSubjectRow): Promise<void> {
    const grade = this.selectedGrade();
    if (!grade) return;

    const currentYear = this.selectedYear();
    const isCurrentlyAssigned = row.isAssigned;
    const nextStatus = !isCurrentlyAssigned;

    this.isOperating.set(true);

    try {
      if (row.gradeSubjectId) {
        // Ya existe en la base de datos -> actualizar campo enabled
        const updated = await this.gradeSubjectService.updateGradeSubject(row.gradeSubjectId, {
          enabled: nextStatus,
        });

        this.allYearGradeSubjects.update(list =>
          list.map(item => (item.id === row.gradeSubjectId ? updated : item))
        );

        this.showAlert(
          nextStatus
            ? `Asignatura "${row.name}" asignada a ${grade.description}`
            : `Asignatura "${row.name}" deshabilitada de ${grade.description}`,
          'success'
        );
      } else {
        // No existe registro en la base de datos -> crear nueva asignación
        const created = await this.gradeSubjectService.createGradeSubject({
          grade: grade.id,
          subject: row.subjectId,
          academicYear: currentYear,
          weeklyHours: row.hours,
          enabled: true,
        });

        this.allYearGradeSubjects.update(list => [...list, created]);

        this.showAlert(
          `Asignatura "${row.name}" (${row.hours}h) asignada exitosamente a ${grade.description}`,
          'success'
        );
      }
    } catch (error: any) {
      console.error('Error al actualizar asignación:', error);
      const msg = error?.error?.message || error?.message || 'Error al actualizar asignación curricular';
      this.showAlert(msg, 'error');
    } finally {
      this.isOperating.set(false);
    }
  }

  /**
   * Seleccionar todas las materias que aún no estén asignadas/habilitadas
   */
  public async selectAll(): Promise<void> {
    const unassigned = this.rows().filter(r => !r.isAssigned);
    if (unassigned.length === 0) return;

    this.isOperating.set(true);
    let successCount = 0;
    let errorMessage = '';

    for (const row of unassigned) {
      try {
        if (row.gradeSubjectId) {
          const updated = await this.gradeSubjectService.updateGradeSubject(row.gradeSubjectId, {
            enabled: true,
          });
          this.allYearGradeSubjects.update(list =>
            list.map(item => (item.id === row.gradeSubjectId ? updated : item))
          );
        } else {
          const created = await this.gradeSubjectService.createGradeSubject({
            grade: this.selectedGradeId(),
            subject: row.subjectId,
            academicYear: this.selectedYear(),
            weeklyHours: row.hours,
            enabled: true,
          });
          this.allYearGradeSubjects.update(list => [...list, created]);
        }
        successCount++;
      } catch (err: any) {
        errorMessage = err?.error?.message || err?.message || 'Límite o error de asignación';
        break; // Detener si se excede el tope de 40 horas u ocurre otro error
      }
    }

    this.isOperating.set(false);
    if (errorMessage) {
      this.showAlert(`Se asignaron ${successCount} asignaturas. Aviso: ${errorMessage}`, 'warning');
    } else {
      this.showAlert(`Todas las asignaturas (${successCount}) han sido asignadas exitosamente`, 'success');
    }
  }

  /**
   * Desmarcar/Quitar todas las materias asignadas
   */
  public async deselectAll(): Promise<void> {
    const assigned = this.rows().filter(r => r.isAssigned && r.gradeSubjectId);
    if (assigned.length === 0) return;

    this.isOperating.set(true);
    let deactivatedCount = 0;

    for (const row of assigned) {
      if (row.gradeSubjectId) {
        try {
          const updated = await this.gradeSubjectService.updateGradeSubject(row.gradeSubjectId, {
            enabled: false,
          });
          this.allYearGradeSubjects.update(list =>
            list.map(item => (item.id === row.gradeSubjectId ? updated : item))
          );
          deactivatedCount++;
        } catch (err) {
          console.error(`Error al desmarcar ${row.name}:`, err);
        }
      }
    }

    this.isOperating.set(false);
    this.showAlert(`Se han quitado ${deactivatedCount} asignaturas de este grado`, 'success');
  }

  private showAlert(message: string, type: 'success' | 'warning' | 'error'): void {
    this.alertMessage.set({ message, type });
    setTimeout(() => {
      if (this.alertMessage()?.message === message) {
        this.alertMessage.set(null);
      }
    }, 5000);
  }
}

