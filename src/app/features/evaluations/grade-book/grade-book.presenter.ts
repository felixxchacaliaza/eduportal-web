import { Injectable, inject, signal, computed } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationService } from './services/evaluation.service';
import { GradeSectionService } from '../../../core/api/services/grade-section.service';
import { SubjectService } from '../../../core/api/services/subject.service';
import { GradeBookFormPresenter } from './form/grade-book-form.presenter';
import { EvaluationPeriodConfig } from './models/evaluation-period-config.interface';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';

/**
 * ============================================================================
 * GradeBookPresenter (Headless Brain)
 * ============================================================================
 * Presentador principal para la gestión reactiva de la matriz de notas.
 *
 * @remarks
 * Encapsula:
 * - Consulta y selección reactiva de salones escolares y asignaturas.
 * - Sincronización con las reglas institucionales MINEDU (RUL-004 y RUL-005).
 * - Computación en memoria de tarjetas KPI del salón (Aprobados, Promedio General).
 * - Orquestación de guardado por lote hacia PUT /api/evaluations/bulk-update.
 * ============================================================================
 */
@Injectable()
export class GradeBookPresenter {
  private readonly evaluationService = inject(EvaluationService);
  private readonly gradeSectionService = inject(GradeSectionService);
  private readonly subjectService = inject(SubjectService);
  public readonly formPresenter = inject(GradeBookFormPresenter);
  private readonly snackBar = inject(MatSnackBar);

  /** Catálogos reactivos */
  public readonly gradeSections = signal<readonly any[]>([]);
  public readonly subjects = signal<readonly any[]>([]);
  public readonly periodConfigs = signal<readonly EvaluationPeriodConfig[]>([]);

  /** Filtros seleccionados */
  public readonly selectedGradeSectionId = signal<string>('');
  public readonly selectedSubjectId = signal<string>('');
  public readonly academicYear = signal<string>('2026');

  /** Estados operativos */
  public readonly isLoading = signal<boolean>(false);
  public readonly isSaving = signal<boolean>(false);

  /** Trigger reactivo para cambios en las filas del FormArray */
  private readonly formArrayVersion = signal<number>(0);

  /**
   * Tarjetas estadísticas de rendimiento escolar computadas en caliente.
   */
  public readonly cards = computed<readonly InfoCardData[]>(() => {
    // Forzar lectura reactiva de la versión de filas
    this.formArrayVersion();

    const rawRows = this.formPresenter.rows.getRawValue() as any[];
    const totalStudents = rawRows.length;

    let passCount = 0;
    let failCount = 0;
    let sumAverages = 0;
    let gradedCount = 0;

    for (const r of rawRows) {
      const avgVal = r['finalAverage'];
      if (avgVal !== null && avgVal !== undefined && !isNaN(Number(avgVal))) {
        const avg = Number(avgVal);
        sumAverages += avg;
        gradedCount++;
        if (avg >= 11) {
          passCount++;
        } else {
          failCount++;
        }
      }
    }

    const classAverage = gradedCount > 0 ? (sumAverages / gradedCount).toFixed(1) : '--';

    return [
      {
        label: 'Alumnos Matriculados',
        value: totalStudents,
        icon: 'groups',
        description: 'Padrón oficial del salón seleccionado',
        tone: 'neutral'
      },
      {
        label: 'Alumnos Aprobados',
        value: passCount,
        icon: 'check_circle',
        description: 'Nota acumulada vigesimal ≥ 11',
        tone: 'success'
      },
      {
        label: 'Alumnos en Riesgo',
        value: failCount,
        icon: 'warning',
        description: 'Nota acumulada vigesimal < 11',
        tone: 'danger'
      },
      {
        label: 'Promedio General',
        value: classAverage,
        icon: 'analytics',
        description: 'Rendimiento académico global del aula',
        tone: 'info'
      }
    ];
  });

  /**
   * Inicialización del módulo: carga selectores, periodos y matriz inicial.
   */
  public async init(): Promise<void> {
    this.isLoading.set(true);
    try {
      const year = this.academicYear();
      const [sections, subs, periods] = await Promise.all([
        this.gradeSectionService.getGradeSections({ academicYear: year }),
        this.subjectService.getSubjects(),
        this.evaluationService.getEvaluationPeriods(year)
      ]);

      this.gradeSections.set(sections || []);
      this.subjects.set(subs || []);
      this.periodConfigs.set(periods || []);

      // Seleccionar salón y asignatura por defecto si existen (preferir Matemática para coincidir con seeders)
      if (sections && sections.length > 0) {
        this.selectedGradeSectionId.set(sections[0].id);
      }
      if (subs && subs.length > 0) {
        const mathSubject = subs.find((s: any) =>
          s.name?.toLowerCase().includes('matemática') ||
          s.name?.toLowerCase().includes('matematica') ||
          s.code === 'MAT-001'
        );
        this.selectedSubjectId.set(mathSubject ? mathSubject.id : subs[0].id);
      }

      await this.loadMatrix();
    } catch (error) {
      console.error('Error al inicializar la matriz de calificaciones:', error);
      this.snackBar.open('Error al cargar datos iniciales de calificaciones', 'Cerrar', {
        duration: 4000
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cambia el salón escolar seleccionado y recarga la matriz.
   */
  public async setGradeSection(id: string): Promise<void> {
    this.selectedGradeSectionId.set(id);
    await this.loadMatrix();
  }

  /**
   * Cambia la asignatura curricular seleccionada y recarga la matriz.
   */
  public async setSubject(id: string): Promise<void> {
    this.selectedSubjectId.set(id);
    await this.loadMatrix();
  }

  /**
   * Consulta las actas de evaluación de la combinación actual y puebla la matriz.
   */
  public async loadMatrix(): Promise<void> {
    const gradeSectionId = this.selectedGradeSectionId();
    const subjectId = this.selectedSubjectId();
    const academicYear = this.academicYear();

    if (!gradeSectionId || !subjectId) {
      this.formPresenter.rows.clear();
      this.notifyFormChange();
      return;
    }

    this.isLoading.set(true);
    try {
      const matrixData = await this.evaluationService.getMatrix({
        gradeSectionId,
        subjectId,
        academicYear
      });

      this.formPresenter.populate(matrixData, this.periodConfigs());

      // Suscribirse a cambios en el FormArray para actualizar las KPI cards
      this.formPresenter.rows.valueChanges.subscribe(() => {
        this.notifyFormChange();
      });

      this.notifyFormChange();
    } catch (error) {
      console.error('Error al cargar la planilla de notas:', error);
      this.snackBar.open('Error al consultar planilla de notas del backend', 'Cerrar', {
        duration: 3500
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Persiste masivamente las calificaciones hacia el backend respetando candados.
   */
  public async save(): Promise<void> {
    if (this.formPresenter.rows.length === 0) return;

    this.isSaving.set(true);
    try {
      const payload = this.formPresenter.getRawPayload();
      await this.evaluationService.bulkUpdate(payload);

      this.snackBar.open('¡Calificaciones guardadas exitosamente!', 'Aceptar', {
        duration: 3500,
        panelClass: ['snackbar-success']
      });

      await this.loadMatrix();
    } catch (error: any) {
      console.error('Error al guardar calificaciones masivamente:', error);
      this.snackBar.open(
        error?.error?.message || 'Error al persistir calificaciones en el servidor',
        'Cerrar',
        { duration: 4000 }
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  private notifyFormChange(): void {
    this.formArrayVersion.update(v => v + 1);
  }
}
