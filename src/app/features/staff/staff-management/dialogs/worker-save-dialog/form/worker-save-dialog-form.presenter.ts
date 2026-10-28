import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { PersonService } from '../../../../students/student-management/services/person.service';
import { PositionService } from '../../../services/position.service';
import { WorkerSaveDialogFormModel } from './models/worker-save-dialog-form.model';
import { WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT } from './models/worker-save-dialog-form.model.constant';
import { staffDniAsyncValidator } from '../../../validators/staff-dni-async.validator';
import { IWorker, IPosition, ICreateWorkerRequestDto } from '../../../models';

/**
 * ============================================================================
 * WorkerSaveDialogFormPresenter
 * ============================================================================
 * Presentador de formulario desacoplado para el modal de trabajadores administrativos.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class WorkerSaveDialogFormPresenter {
  private readonly fb = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  private readonly positionService = inject(PositionService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly formModel = new WorkerSaveDialogFormModel();
  public readonly workerConstant = WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT;

  public readonly form: FormGroup;
  public readonly positions = signal<IPosition[]>([]);
  public readonly isSearchingCivilPerson = signal<boolean>(false);
  public readonly isLoadingPositions = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      dni: this.formModel.dni,
      firstName: this.formModel.firstName,
      lastName: this.formModel.lastName,
      gender: this.formModel.gender,
      personalEmail: this.formModel.personalEmail,
      phone: this.formModel.phone,
      address: this.formModel.address,
      position: this.formModel.position,
      shift: this.formModel.shift,
      hireDate: this.formModel.hireDate
    });

    this.setupDniAutoLookup();
    this.loadPositions();
  }

  /**
   * Carga el catálogo reactivo de cargos institucionales.
   */
  public async loadPositions(): Promise<void> {
    this.isLoadingPositions.set(true);
    try {
      const list = await this.positionService.getPositions();
      this.positions.set(list);
      // Si no hay cargo seleccionado y hay cargos disponibles, selecciona el primero
      if (!this.form.get('position')?.value && list.length > 0) {
        this.form.get('position')?.setValue(list[0].id);
      }
    } catch (err) {
      console.error('Error al cargar cargos institucionales:', err);
    } finally {
      this.isLoadingPositions.set(false);
    }
  }

  /**
   * Inicializa el formulario en modo creación o edición.
   */
  public initialize(worker?: IWorker): void {
    if (worker) {
      const positionId = typeof worker.position === 'object' ? worker.position.id : worker.position;
      const formattedDate = worker.hireDate ? new Date(worker.hireDate).toISOString().substring(0, 10) : '';

      this.form.patchValue({
        dni: worker.person?.dni || '',
        firstName: worker.person?.firstName || '',
        lastName: worker.person?.lastName || '',
        gender: worker.person?.gender || 'M',
        personalEmail: worker.person?.personalEmail || '',
        phone: worker.person?.phone || '',
        address: worker.person?.address || '',
        position: positionId || '',
        shift: worker.shift || 'COMPLETO',
        hireDate: formattedDate
      });

      // Si editamos, excluye su propio DNI del validador asíncrono
      this.form.get('dni')?.setAsyncValidators(
        staffDniAsyncValidator(this.personService, worker.person?.dni)
      );
    } else {
      // Modo creación: configurar validador asíncrono estricto
      this.form.get('dni')?.setAsyncValidators(staffDniAsyncValidator(this.personService));
    }
  }

  /**
   * Obtiene el mensaje de error de un control específico.
   */
  public getErrorMessage(controlName: string): string {
    return this.formModel.getErrorMessage(controlName, this.form).error;
  }

  /**
   * Valida si el formulario es completamente válido para persistencia.
   */
  public isValid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  /**
   * Construye el DTO limpio para enviar a la API REST.
   */
  public getPayload(): ICreateWorkerRequestDto {
    const raw = this.form.value;
    return {
      dni: String(raw.dni).trim(),
      firstName: String(raw.firstName).trim(),
      lastName: String(raw.lastName).trim(),
      gender: raw.gender === 'F' ? 'FEMENINO' : 'MASCULINO',
      personalEmail: String(raw.personalEmail).trim(),
      phone: raw.phone ? String(raw.phone).trim() : undefined,
      address: raw.address ? String(raw.address).trim() : undefined,
      position: raw.position,
      shift: raw.shift,
      hireDate: raw.hireDate
    };
  }

  /**
   * Configura la escucha del DNI para auto-completar datos si la persona ya existe en el padrón civil.
   */
  private setupDniAutoLookup(): void {
    this.form.get('dni')?.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      filter(dni => typeof dni === 'string' && dni.trim().length === 8 && /^\d{8}$/.test(dni)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(async (dni) => {
      this.isSearchingCivilPerson.set(true);
      try {
        const check = await this.personService.checkDni(String(dni));
        if (check && check.person) {
          this.form.patchValue({
            firstName: check.person.firstName,
            lastName: check.person.lastName,
            gender: check.person.gender || 'M',
            personalEmail: check.person.personalEmail || '',
            phone: check.person.phone || '',
            address: check.person.address || ''
          });
        }
      } finally {
        this.isSearchingCivilPerson.set(false);
      }
    });
  }
}
