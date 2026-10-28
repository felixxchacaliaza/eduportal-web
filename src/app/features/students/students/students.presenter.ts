import { Injectable, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';
import { StudentService } from './services/student.service';
import { IStudent } from './models';
import { StudentSaveDialogComponent } from './dialogs/student-save-dialog/student-save-dialog.component';
import { StudentSaveDialogData } from './dialogs/student-save-dialog/form/models/student-save-dialog-form.interface';
import { EnrollmentSaveDialogComponent } from './dialogs/enrollment-save-dialog/enrollment-save-dialog.component';
import { EnrollmentSaveDialogData } from './dialogs/enrollment-save-dialog/form/models/enrollment-save-dialog-form.interface';

/**
 * ============================================================================
 * StudentsPresenter
 * ============================================================================
 * Presentador de vista (View Presenter) para el Padrón de Estudiantes.
 * Maneja el estado reactivo con Signals, filtrado, KPIs y coordinación de diálogos.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class StudentsPresenter {
  private readonly studentService = inject(StudentService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  public readonly students = signal<readonly IStudent[]>([]);
  public readonly searchTerm = signal<string>('');
  public readonly statusFilter = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  /**
   * Listado derivado filtrado por DNI, nombres, apellidos, código y estado.
   */
  public readonly filteredStudents = computed<readonly IStudent[]>(() => {
    const list = this.students();
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return list.filter(item => {
      // Filtro por estado
      const matchStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && item.enabled) ||
        (status === 'INACTIVE' && !item.enabled);

      if (!matchStatus) return false;

      if (!query) return true;

      const dni = item.person?.dni?.toLowerCase() || '';
      const firstName = item.person?.firstName?.toLowerCase() || '';
      const lastName = item.person?.lastName?.toLowerCase() || '';
      const fullName = `${lastName} ${firstName}`.trim();
      const code = item.code?.toLowerCase() || '';

      return (
        dni.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        fullName.includes(query) ||
        code.includes(query)
      );
    });
  });

  public readonly totalCount = computed(() => this.students().length);

  public readonly activeCount = computed(
    () => this.students().filter(s => s.enabled).length
  );

  public readonly inactiveCount = computed(
    () => this.students().filter(s => !s.enabled).length
  );

  /**
   * Tarjetas métricas estadísticas oficiales del Padrón Escolar.
   */
  public readonly cards = computed<readonly InfoCardData[]>(() => {
    const total = this.totalCount();
    const active = this.activeCount();
    const inactive = this.inactiveCount();

    return [
      {
        label: 'Padrón Total',
        value: total,
        subtitle: 'Estudiantes Registrados',
        color: 'blue',
      },
      {
        label: 'Estudiantes Activos',
        value: active,
        subtitle: 'Habilitados en el sistema',
        color: 'green',
      },
      {
        label: 'Estudiantes Inactivos',
        value: inactive,
        subtitle: 'Dados de baja o suspendidos',
        color: 'amber',
      },
      {
        label: 'Año Lectivo',
        value: '2026',
        subtitle: 'Periodo Escolar Vigente',
        color: 'blue',
      },
    ];
  });

  /**
   * Consulta el padrón de estudiantes desde el API.
   */
  public async loadStudents(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const data = await this.studentService.getStudents();
      this.students.set(data);
    } catch (err: any) {
      console.error('Error al cargar alumnos:', err);
      const msg = err?.error?.message || err?.message || 'Error al obtener la lista de estudiantes';
      this.error.set(msg);
      this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Actualiza el término de búsqueda para filtrado reactivo.
   */
  public setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  /**
   * Actualiza el filtro de estado.
   */
  public setStatusFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.statusFilter.set(status);
  }

  /**
   * Abre el modal de creación de un nuevo alumno.
   */
  public openCreateDialog(): void {
    const dialogData: StudentSaveDialogData = {
      mode: 'create',
    };

    const dialogRef = this.dialog.open(StudentSaveDialogComponent, {
      width: '750px',
      maxWidth: '95vw',
      disableClose: true,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((createdStudent?: IStudent) => {
      if (createdStudent) {
        this.snackBar.open('¡Estudiante registrado exitosamente!', 'OK', { duration: 3500 });
        this.loadStudents();
      }
    });
  }

  /**
   * Abre el modal de edición de datos de un alumno.
   */
  public openEditDialog(student: IStudent): void {
    const dialogData: StudentSaveDialogData = {
      mode: 'edit',
      student,
    };

    const dialogRef = this.dialog.open(StudentSaveDialogComponent, {
      width: '750px',
      maxWidth: '95vw',
      disableClose: true,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((updatedStudent?: IStudent) => {
      if (updatedStudent) {
        this.snackBar.open('¡Estudiante actualizado exitosamente!', 'OK', { duration: 3500 });
        this.loadStudents();
      }
    });
  }

  /**
   * Abre el modal para registrar matrícula anual.
   */
  public openEnrollDialog(student: IStudent): void {
    const dialogData: EnrollmentSaveDialogData = {
      student,
    };

    const dialogRef = this.dialog.open(EnrollmentSaveDialogComponent, {
      width: '620px',
      maxWidth: '95vw',
      disableClose: true,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(enrolled => {
      if (enrolled) {
        this.snackBar.open('¡Matrícula anual registrada con éxito!', 'OK', { duration: 3500 });
      }
    });
  }

  /**
   * Elimina un estudiante tras confirmación.
   */
  public async deleteStudent(student: IStudent): Promise<void> {
    const confirmed = window.confirm(
      `¿Está seguro de eliminar al estudiante "${student.person?.lastName}, ${student.person?.firstName}" (DNI: ${student.person?.dni})?`
    );

    if (!confirmed) return;

    this.isLoading.set(true);
    try {
      await this.studentService.deleteStudent(student.id);
      this.snackBar.open('Estudiante eliminado del padrón.', 'OK', { duration: 3000 });
      await this.loadStudents();
    } catch (err: any) {
      console.error('Error al eliminar estudiante:', err);
      const msg = err?.error?.message || err?.message || 'Error al eliminar estudiante';
      this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
    } finally {
      this.isLoading.set(false);
    }
  }
}
