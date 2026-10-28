import { Injectable, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InfoCardData } from '../../../shared/components/info-card/info-card.component';
import { TeacherService } from './services/teacher.service';
import { WorkerService } from './services/worker.service';
import { ITeacher, IWorker } from './models';
import { TeacherSaveDialogComponent } from './dialogs/teacher-save-dialog/teacher-save-dialog.component';
import { TeacherSaveDialogData } from './dialogs/teacher-save-dialog/form/models/teacher-save-dialog.interface';
import { WorkerSaveDialogComponent } from './dialogs/worker-save-dialog/worker-save-dialog.component';
import { WorkerSaveDialogData } from './dialogs/worker-save-dialog/form/models/worker-save-dialog.interface';

/**
 * ============================================================================
 * StaffManagementPresenter
 * ============================================================================
 * Presentador de vista (Headless Brain) para la Gestión de Personal Escolar.
 * Maneja el estado reactivo con Signals, filtrado, KPIs y diálogos duales.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class StaffManagementPresenter {
  private readonly teacherService = inject(TeacherService);
  private readonly workerService = inject(WorkerService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  public readonly teachers = signal<readonly ITeacher[]>([]);
  public readonly workers = signal<readonly IWorker[]>([]);
  public readonly selectedTabIndex = signal<number>(0);
  public readonly searchTerm = signal<string>('');
  public readonly statusFilter = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  /**
   * Listado derivado de profesores filtrado por búsqueda y estado.
   */
  public readonly filteredTeachers = computed<readonly ITeacher[]>(() => {
    const list = this.teachers();
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return list.filter(item => {
      const isItemActive = item.enabled !== false;
      const matchStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && isItemActive) ||
        (status === 'INACTIVE' && !isItemActive);

      if (!matchStatus) return false;
      if (!query) return true;

      const dni = item.person?.dni?.toLowerCase() || '';
      const firstName = item.person?.firstName?.toLowerCase() || '';
      const lastName = item.person?.lastName?.toLowerCase() || '';
      const fullName = `${lastName} ${firstName}`.trim();
      const code = item.code?.toLowerCase() || '';
      const specialty = item.specialty?.toLowerCase() || '';

      return (
        dni.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        fullName.includes(query) ||
        code.includes(query) ||
        specialty.includes(query)
      );
    });
  });

  /**
   * Listado derivado de trabajadores filtrado por búsqueda y estado.
   */
  public readonly filteredWorkers = computed<readonly IWorker[]>(() => {
    const list = this.workers();
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return list.filter(item => {
      const isItemActive = item.enabled !== false;
      const matchStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && isItemActive) ||
        (status === 'INACTIVE' && !isItemActive);

      if (!matchStatus) return false;
      if (!query) return true;

      const dni = item.person?.dni?.toLowerCase() || '';
      const firstName = item.person?.firstName?.toLowerCase() || '';
      const lastName = item.person?.lastName?.toLowerCase() || '';
      const fullName = `${lastName} ${firstName}`.trim();
      const code = item.code?.toLowerCase() || '';
      const posName = typeof item.position === 'object' ? item.position?.name?.toLowerCase() || '' : '';

      return (
        dni.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        fullName.includes(query) ||
        code.includes(query) ||
        posName.includes(query)
      );
    });
  });

  // KPI Computations
  public readonly totalStaffCount = computed(
    () => this.teachers().length + this.workers().length
  );

  public readonly activeTeachersCount = computed(
    () => this.teachers().filter(t => t.enabled !== false).length
  );

  public readonly totalContractedHours = computed(
    () => this.teachers()
      .filter(t => t.enabled !== false)
      .reduce((acc, t) => acc + (t.contractedHours || 0), 0)
  );

  public readonly activeWorkersCount = computed(
    () => this.workers().filter(w => w.enabled !== false).length
  );

  /**
   * Tarjetas estadísticas reactivas oficiales de la plana escolar.
   */
  public readonly cards = computed<readonly InfoCardData[]>(() => {
    return [
      {
        label: 'Total Colaboradores',
        value: this.totalStaffCount(),
        icon: 'groups',
        description: 'Plana docente y administrativa activa',
        tone: 'neutral'
      },
      {
        label: 'Docentes Activos',
        value: this.activeTeachersCount(),
        icon: 'school',
        description: 'Profesores titulares en aula',
        tone: 'success'
      },
      {
        label: 'Horas de Cátedra',
        value: `${this.totalContractedHours()} hrs`,
        icon: 'schedule',
        description: 'Carga lectiva semanal contratada',
        tone: 'info'
      },
      {
        label: 'Personal Administrativo',
        value: this.activeWorkersCount(),
        icon: 'badge',
        description: 'Cargos y soporte operativo',
        tone: 'warning'
      }
    ];
  });

  /**
   * Carga inicial sincronizada de profesores y trabajadores administrativos.
   */
  public async loadInitialData(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const [teachersList, workersList] = await Promise.all([
        this.teacherService.getTeachers(),
        this.workerService.getWorkers()
      ]);
      this.teachers.set(teachersList);
      this.workers.set(workersList);
    } catch (err: any) {
      console.error('Error al cargar personal escolar:', err);
      this.error.set('No se pudo conectar con el catálogo de personal. Verifique la API.');
    } finally {
      this.isLoading.set(false);
    }
  }

  public setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  public setStatusFilter(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.statusFilter.set(status);
  }

  public setSelectedTab(index: number): void {
    this.selectedTabIndex.set(index);
  }

  /**
   * Abre el modal para registrar un nuevo docente o colaborador administrativo.
   */
  public openCreateDialog(): void {
    if (this.selectedTabIndex() === 0) {
      this.openCreateTeacherDialog();
    } else {
      this.openCreateWorkerDialog();
    }
  }

  public openCreateTeacherDialog(): void {
    const dialogRef = this.dialog.open<TeacherSaveDialogComponent, TeacherSaveDialogData>(
      TeacherSaveDialogComponent,
      {
        width: '650px',
        disableClose: true,
        data: { mode: 'create' }
      }
    );

    dialogRef.afterClosed().subscribe((result: ITeacher | undefined) => {
      if (result) {
        this.teachers.update(prev => [result, ...prev]);
        this.snackBar.open('Profesor registrado correctamente en la institución', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  public openEditTeacherDialog(teacher: ITeacher): void {
    const dialogRef = this.dialog.open<TeacherSaveDialogComponent, TeacherSaveDialogData>(
      TeacherSaveDialogComponent,
      {
        width: '650px',
        disableClose: true,
        data: { mode: 'edit', teacher }
      }
    );

    dialogRef.afterClosed().subscribe((result: ITeacher | undefined) => {
      if (result) {
        this.teachers.update(prev => prev.map(t => (t.id === result.id ? result : t)));
        this.snackBar.open('Datos del docente actualizados satisfactoriamente', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  public async toggleTeacherStatus(teacher: ITeacher): Promise<void> {
    try {
      const updated = await this.teacherService.toggleTeacherStatus(teacher.id);
      this.teachers.update(prev =>
        prev.map(t => (t.id === teacher.id ? { ...t, enabled: !t.enabled } : t))
      );
      const action = updated.enabled ? 'reactivado' : 'dado de baja';
      this.snackBar.open(`Profesor ${action} con éxito`, 'Cerrar', { duration: 3000 });
    } catch (err: any) {
      this.snackBar.open('Error al cambiar el estado del docente', 'Cerrar', { duration: 4000 });
    }
  }

  public openCreateWorkerDialog(): void {
    const dialogRef = this.dialog.open<WorkerSaveDialogComponent, WorkerSaveDialogData>(
      WorkerSaveDialogComponent,
      {
        width: '650px',
        disableClose: true,
        data: { mode: 'create' }
      }
    );

    dialogRef.afterClosed().subscribe((result: IWorker | undefined) => {
      if (result) {
        this.workers.update(prev => [result, ...prev]);
        this.snackBar.open('Colaborador administrativo registrado exitosamente', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  public openEditWorkerDialog(worker: IWorker): void {
    const dialogRef = this.dialog.open<WorkerSaveDialogComponent, WorkerSaveDialogData>(
      WorkerSaveDialogComponent,
      {
        width: '650px',
        disableClose: true,
        data: { mode: 'edit', worker }
      }
    );

    dialogRef.afterClosed().subscribe((result: IWorker | undefined) => {
      if (result) {
        this.workers.update(prev => prev.map(w => (w.id === result.id ? result : w)));
        this.snackBar.open('Datos del colaborador actualizados satisfactoriamente', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  public async toggleWorkerStatus(worker: IWorker): Promise<void> {
    try {
      const updated = await this.workerService.toggleWorkerStatus(worker.id);
      this.workers.update(prev =>
        prev.map(w => (w.id === worker.id ? { ...w, enabled: !w.enabled } : w))
      );
      const action = updated.enabled ? 'reactivado' : 'dado de baja';
      this.snackBar.open(`Colaborador ${action} con éxito`, 'Cerrar', { duration: 3000 });
    } catch (err: any) {
      this.snackBar.open('Error al cambiar el estado del colaborador', 'Cerrar', { duration: 4000 });
    }
  }
}
