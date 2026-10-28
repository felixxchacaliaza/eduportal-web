import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { PersonService } from '../../../../../students/student-management/services/person.service';
import { TeacherSaveDialogFormModel } from './models/teacher-save-dialog-form.model';
import { TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT } from './models/teacher-save-dialog-form.model.constant';
import { staffDniAsyncValidator } from '../../../validators/staff-dni-async.validator';
import { ITeacher, ICreateTeacherRequestDto } from '../../../models';

/**
 * ============================================================================
 * TeacherSaveDialogFormPresenter
 * ============================================================================
 * Presentador de formulario desacoplado para el modal de docentes.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class TeacherSaveDialogFormPresenter {
  private readonly fb = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly formModel = new TeacherSaveDialogFormModel();
  public readonly teacherConstant = TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT;

  public readonly form: FormGroup;
  public readonly isSearchingCivilPerson = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      dni: this.formModel.dni,
      firstName: this.formModel.firstName,
      lastName: this.formModel.lastName,
      gender: this.formModel.gender,
      personalEmail: this.formModel.personalEmail,
      phone: this.formModel.phone,
      address: this.formModel.address,
      specialty: this.formModel.specialty,
      academicDegree: this.formModel.academicDegree,
      contractedHours: this.formModel.contractedHours
    });

    this.setupDniAutoLookup();
  }

  /**
   * Inicializa el formulario en modo creación o edición.
   */
  public initialize(teacher?: ITeacher): void {
    if (teacher) {
      this.form.patchValue({
        dni: teacher.person?.dni || '',
        firstName: teacher.person?.firstName || '',
        lastName: teacher.person?.lastName || '',
        gender: teacher.person?.gender || 'M',
        personalEmail: teacher.person?.personalEmail || '',
        phone: teacher.person?.phone || '',
        address: teacher.person?.address || '',
        specialty: teacher.specialty || '',
        academicDegree: teacher.academicDegree || 'LICENCIADO',
        contractedHours: teacher.contractedHours || 30
      });

      // Si editamos, excluye su propio DNI del validador asíncrono
      this.form.get('dni')?.setAsyncValidators(
        staffDniAsyncValidator(this.personService, teacher.person?.dni)
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
  public getPayload(): ICreateTeacherRequestDto {
    const raw = this.form.value;
    return {
      dni: String(raw.dni).trim(),
      firstName: String(raw.firstName).trim(),
      lastName: String(raw.lastName).trim(),
      gender: raw.gender === 'F' ? 'FEMENINO' : 'MASCULINO',
      personalEmail: String(raw.personalEmail).trim(),
      phone: raw.phone ? String(raw.phone).trim() : undefined,
      address: raw.address ? String(raw.address).trim() : undefined,
      specialty: String(raw.specialty).trim(),
      academicDegree: raw.academicDegree,
      contractedHours: Number(raw.contractedHours)
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
