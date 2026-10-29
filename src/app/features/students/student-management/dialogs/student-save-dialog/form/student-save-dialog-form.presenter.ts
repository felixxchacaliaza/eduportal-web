import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { PersonService } from '../../../services/person.service';
import { StudentSaveDialogFormModel } from './models/student-save-dialog-form.model';
import { GuardianFormModel } from './models/guardian-form.model';
import { STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT } from './models/student-save-dialog-form.model.constant';
import { GUARDIAN_FORM_MODEL_CONSTANT } from './models/guardian-form.model.constant';
import { dniAsyncValidator } from '../../../validators/dni-async.validator';
import { IStudent, ICreateStudentRequestDto, IGuardianFormItemDto } from '../../../models';

/**
 * ============================================================================
 * StudentSaveDialogFormPresenter
 * ============================================================================
 * Presentador de formulario scoped para el modal de alumnos.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class StudentSaveDialogFormPresenter {
  private readonly fb = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly formModel = new StudentSaveDialogFormModel();
  public readonly guardianModel = new GuardianFormModel();
  public readonly studentConstant = STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT;
  public readonly guardianConstant = GUARDIAN_FORM_MODEL_CONSTANT;

  public readonly form: FormGroup;
  public readonly guardiansArray: FormArray<FormGroup>;

  public readonly isSearchingCivilPerson = signal<boolean>(false);
  public readonly isStudentExists = signal<boolean>(false);

  constructor() {
    this.guardiansArray = this.fb.array<FormGroup>([]);

    this.form = this.fb.group({
      dni: this.formModel.dni,
      firstName: this.formModel.firstName,
      lastName: this.formModel.lastName,
      gender: this.formModel.gender,
      personalEmail: this.formModel.personalEmail,
      phone: this.formModel.phone,
      address: this.formModel.address,
      entryYear: this.formModel.entryYear,
      guardians: this.guardiansArray
    });

    this.setupDniAutoLookup();
  }

  /**
   * Inicializa el formulario en modo creación o edición.
   */
  public initialize(student?: IStudent): void {
    if (student) {
      this.form.patchValue({
        dni: student.person?.dni || '',
        firstName: student.person?.firstName || '',
        lastName: student.person?.lastName || '',
        gender: student.person?.gender || 'M',
        personalEmail: student.person?.personalEmail || '',
        phone: student.person?.phone || '',
        address: student.person?.address || '',
        entryYear: student.entryYear || '2026'
      });

      // Configurar validador asíncrono excluyendo su propio DNI
      this.form.get('dni')?.setAsyncValidators(
        dniAsyncValidator(this.personService, student.person?.dni)
      );

      // Cargar apoderados existentes
      this.guardiansArray.clear();
      if (Array.isArray(student.guardians) && student.guardians.length > 0) {
        student.guardians.forEach(g => {
          this.addGuardian({
            dni: g.person?.dni || '',
            firstName: g.person?.firstName || '',
            lastName: g.person?.lastName || '',
            relationship: g.relationship || 'PADRE',
            isPrimary: g.isPrimary || false,
            phone: g.person?.phone || '',
            email: g.person?.personalEmail || ''
          });
        });
      } else {
        this.addGuardian({ isPrimary: true });
      }
    } else {
      // Modo creación: configurar validador asíncrono
      this.form.get('dni')?.setAsyncValidators(dniAsyncValidator(this.personService));
      this.guardiansArray.clear();
      // Agregar al menos 1 apoderado inicial como principal
      this.addGuardian({ isPrimary: true });
    }
  }

  /**
   * Añade una nueva fila de apoderado al FormArray.
   */
  public addGuardian(initialData?: Partial<IGuardianFormItemDto>): void {
    const guardianGroup = this.fb.group({
      dni: [initialData?.dni || '', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      firstName: [initialData?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [initialData?.lastName || '', [Validators.required, Validators.minLength(2)]],
      relationship: [initialData?.relationship || 'PADRE', [Validators.required]],
      isPrimary: [initialData?.isPrimary || false],
      phone: [initialData?.phone || '', [Validators.pattern(/^\d{9}$/)]],
      email: [initialData?.email || '', [Validators.email]]
    });

    // Monitorear DNI del apoderado para autocompletar si ya existe en el padrón civil
    guardianGroup.get('dni')?.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      filter(dni => typeof dni === 'string' && dni.trim().length === 8 && /^\d{8}$/.test(dni)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(async (dni) => {
      const person = await this.personService.getPersonByDni(String(dni));
      if (person) {
        guardianGroup.patchValue({
          firstName: person.firstName,
          lastName: person.lastName,
          phone: person.phone || '',
          email: person.personalEmail || ''
        });
      }
    });

    this.guardiansArray.push(guardianGroup);
  }

  /**
   * Remueve una fila de apoderado asegurando que quede al menos uno.
   */
  public removeGuardian(index: number): void {
    if (this.guardiansArray.length > 1) {
      const wasPrimary = this.guardiansArray.at(index).get('isPrimary')?.value;
      this.guardiansArray.removeAt(index);
      // Si eliminó al principal, asignar el primero restante como principal
      if (wasPrimary && this.guardiansArray.length > 0) {
        this.setPrimaryGuardian(0);
      }
    }
  }

  /**
   * Marca exclusivamente un apoderado como contacto principal.
   */
  public setPrimaryGuardian(selectedIndex: number): void {
    this.guardiansArray.controls.forEach((group, idx) => {
      group.get('isPrimary')?.setValue(idx === selectedIndex);
    });
  }

  /**
   * Obtiene el mensaje de error de un campo del alumno.
   */
  public getErrorMessage(controlName: string): string {
    return this.formModel.getErrorMessage(controlName, this.form).error;
  }

  /**
   * Obtiene el mensaje de error de un control dentro de un apoderado.
   */
  public getGuardianErrorMessage(index: number, controlName: string): string {
    const group = this.guardiansArray.at(index);
    if (!group) return '';
    return this.guardianModel.getErrorMessage(controlName, group).error;
  }

  /**
   * Valida si el formulario está listo para enviarse.
   */
  public isValid(): boolean {
    // Validar form principal
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    // Regla de Negocio RN-ACT-02: Al menos un apoderado con isPrimary: true
    const hasPrimary = this.guardiansArray.controls.some(g => g.get('isPrimary')?.value === true);
    if (!hasPrimary && this.guardiansArray.length > 0) {
      this.setPrimaryGuardian(0);
    }

    // Regla de Negocio RN-ACT-02: El alumno no puede ser su propio apoderado
    const studentDni = this.form.get('dni')?.value?.trim();
    const isSelfGuardian = this.guardiansArray.controls.some(g => g.get('dni')?.value?.trim() === studentDni);
    if (isSelfGuardian) {
      return false;
    }

    return true;
  }

  /**
   * Construye el payload limpio para envío a la API REST.
   */
  public getPayload(): ICreateStudentRequestDto {
    const raw = this.form.value;
    const rawGuardians: IGuardianFormItemDto[] = this.guardiansArray.value;

    return {
      dni: String(raw.dni).trim(),
      firstName: String(raw.firstName).trim(),
      lastName: String(raw.lastName).trim(),
      gender: raw.gender,
      personalEmail: String(raw.personalEmail).trim(),
      phone: raw.phone ? String(raw.phone).trim() : undefined,
      address: raw.address ? String(raw.address).trim() : undefined,
      entryYear: String(raw.entryYear || '2026').trim(),
      guardians: rawGuardians.map(g => ({
        dni: String(g.dni).trim(),
        firstName: String(g.firstName).trim(),
        lastName: String(g.lastName).trim(),
        relationship: g.relationship,
        isPrimary: Boolean(g.isPrimary),
        phone: g.phone ? String(g.phone).trim() : undefined,
        email: g.email ? String(g.email).trim() : undefined
      }))
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
        if (check.exists && check.person) {
          this.form.patchValue({
            firstName: check.person.firstName,
            lastName: check.person.lastName,
            gender: check.person.gender || 'M',
            personalEmail: check.person.personalEmail,
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
