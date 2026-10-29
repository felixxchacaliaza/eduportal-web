import { Injectable, inject, signal, computed } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceService } from './services/attendance.service';
import { GradeSectionService } from '../../../core/api/services/grade-section.service';
import { EnrollmentService } from '../../students/student-management/services/enrollment.service';
import { AttendanceFormPresenter } from './form/attendance-form.presenter';
import { IncidentSaveDialogComponent } from './dialogs/incident-save-dialog/incident-save-dialog.component';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';
import { IAttendance } from './models/attendance.interface';

/**
 * ============================================================================
 * AttendanceManagementPresenter (Headless Brain)
 * ============================================================================
 * Presentador principal para la gestión de la matriz de asistencia diaria escolar.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class AttendanceManagementPresenter {
  private readonly attendanceService = inject(AttendanceService);
  private readonly gradeSectionService = inject(GradeSectionService);
  private readonly enrollmentService = inject(EnrollmentService);
  public readonly formPresenter = inject(AttendanceFormPresenter);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  /** Catálogos reactivos */
  public readonly gradeSections = signal<readonly any[]>([]);
  public readonly selectedGradeSectionId = signal<string>('');
  public readonly selectedDate = signal<string>(new Date().toISOString().substring(0, 10));
  public readonly academicYear = signal<string>('2026');

  /** Estados operativos */
  public readonly isLoading = signal<boolean>(false);
  public readonly isSaving = signal<boolean>(false);

  /**
   * Tarjetas KPI estadísticas de asistencia diaria computadas reactivamente.
   */
  public readonly cards = computed<readonly InfoCardData[]>(() => {
    const total = this.formPresenter.totalCount();
    const pres = this.formPresenter.presentCount();
    const late = this.formPresenter.lateCount();
    const abs = this.formPresenter.absentCount();
    const just = this.formPresenter.justifiedCount();

    const attendanceRate = total > 0 ? Math.round((pres / total) * 100) : 0;

    return [
      {
        label: 'Total Matriculados',
        value: total,
        subtitle: 'Padrón escolar oficial',
        color: 'blue'
      },
      {
        label: 'Alumnos Presentes',
        value: `${pres} (${attendanceRate}%)`,
        subtitle: 'Asistencia puntual confirmada',
        color: 'green'
      },
      {
        label: 'Tardanzas',
        value: late,
        subtitle: 'Ingreso posterior al horario',
        color: 'amber'
      },
      {
        label: 'Faltas / Justificados',
        value: `${abs} / ${just}`,
        subtitle: `${abs} inasistencias, ${just} justificadas`
      }
    ];
  });

  /**
   * Inicializa la vista cargando salones escolares y la primera nómina.
   */
  public async init(): Promise<void> {
    this.isLoading.set(true);
    try {
      const year = this.academicYear();
      const sections = await this.gradeSectionService.getGradeSections({ academicYear: year });
      this.gradeSections.set(sections || []);

      if (sections && sections.length > 0) {
        const initialId = sections[0].id;
        this.selectedGradeSectionId.set(initialId);
        this.formPresenter.form.patchValue({
          gradeSection: initialId,
          date: this.selectedDate(),
          academicYear: year
        });
        await this.loadAttendances();
      }
    } catch (error) {
      console.error('Error al inicializar control de asistencia:', error);
      this.snackBar.open('Error al cargar salones para asistencia', 'Cerrar', { duration: 4000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cambia el salón seleccionado y recarga los estudiantes y registros.
   */
  public async setGradeSection(id: string): Promise<void> {
    this.selectedGradeSectionId.set(id);
    this.formPresenter.form.patchValue({ gradeSection: id });
    await this.loadAttendances();
  }

  /**
   * Cambia la fecha de asistencia y sincroniza los registros existentes.
   */
  public async setDate(date: string): Promise<void> {
    this.selectedDate.set(date);
    this.formPresenter.form.patchValue({ date });
    await this.loadAttendances();
  }

  /**
   * Carga los alumnos matriculados del salón y las asistencias del día.
   */
  public async loadAttendances(): Promise<void> {
    const sectionId = this.selectedGradeSectionId();
    const date = this.selectedDate();

    if (!sectionId) {
      this.formPresenter.itemsArray.clear();
      this.formPresenter.recalculateCounts();
      return;
    }

    this.isLoading.set(true);
    try {
      const [enrollments, attendances] = await Promise.all([
        this.enrollmentService.getBySection(sectionId),
        this.attendanceService.getBySectionAndDate(sectionId, date)
      ]);

      const enrolledStudents = enrollments
        .filter((e: any) => e.status === 'MATRICULADO' && e.student)
        .map((e: any) => e.student);

      this.formPresenter.populate(enrolledStudents, attendances || []);
    } catch (error) {
      console.error('Error al cargar asistencias del aula:', error);
      this.snackBar.open('Error al consultar lista de asistencia', 'Cerrar', { duration: 3500 });
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Marca en bloque a todos los estudiantes como Presentes.
   */
  public markAllPresent(): void {
    this.formPresenter.markAllPresent();
    this.snackBar.open('Se marcaron todos los estudiantes como presentes', 'OK', {
      duration: 2500
    });
  }

  /**
   * Persiste masivamente los estados de asistencia en el backend.
   */
  public async save(): Promise<void> {
    if (this.formPresenter.itemsArray.length === 0) {
      return;
    }

    this.isSaving.set(true);
    try {
      const payload = this.formPresenter.getRawPayload();
      await this.attendanceService.saveBulk(payload);

      this.snackBar.open('Asistencias guardadas exitosamente en el servidor', 'OK', {
        duration: 3500
      });
      await this.loadAttendances();
    } catch (error: any) {
      console.error('Error al guardar asistencias en lote:', error);
      const msg = error?.error?.message || error?.message || 'Error al persistir asistencias';
      this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Despliega el modal de registro de incidencias disciplinarias escolares.
   */
  public openIncidentDialog(studentData: {
    studentId: string;
    studentName: string;
    studentDni: string;
  }): void {
    const dialogRef = this.dialog.open(IncidentSaveDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        studentId: studentData.studentId,
        studentName: studentData.studentName,
        studentDni: studentData.studentDni,
        gradeSectionId: this.selectedGradeSectionId(),
        academicYear: this.academicYear()
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.snackBar.open('Incidencia disciplinaria registrada con éxito', 'OK', {
          duration: 3500
        });
      }
    });
  }
}
