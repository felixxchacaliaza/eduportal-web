import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserFormControls, USER_FORM_DEFAULTS } from './models';
import { User, SaveUserDto } from '../../models';

/**
 * ============================================================================
 * UserSaveDialogPresenter
 * ============================================================================
 * Presentador desacoplado para la gestión del formulario reactivo de usuario.
 * Maneja validaciones condicionales de contraseña y salvaguardas de cuentas.
 * ============================================================================
 */
@Injectable()
export class UserSaveDialogPresenter {
  private readonly fb = inject(FormBuilder);

  public readonly form: FormGroup<UserFormControls> = this.buildForm();
  public readonly isEditing = signal<boolean>(false);
  public readonly isProtected = signal<boolean>(false);
  public readonly hidePassword = signal<boolean>(true);

  public togglePasswordVisibility(): void {
    this.hidePassword.update(prev => !prev);
  }

  public initialize(user?: User): void {
    if (user) {
      this.isEditing.set(true);
      this.isProtected.set(user.isProtected === true);

      this.form.patchValue({
        person: user.person?.id || user.person?._id || '',
        profile: user.profile?.id || user.profile?._id || '',
        email: user.email,
        password: '',
        enabled: user.enabled
      });

      // En edición la contraseña no es obligatoria; solo se valida si se ingresa
      this.form.controls.password.clearValidators();
      this.form.controls.password.setValidators([Validators.minLength(6)]);
      this.form.controls.password.updateValueAndValidity();

      // Si es SuperAdmin protegido, el correo y estado activo están bloqueados
      if (user.isProtected) {
        this.form.controls.enabled.disable();
      }
    } else {
      this.isEditing.set(false);
      this.isProtected.set(false);
      this.form.reset(USER_FORM_DEFAULTS);
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls.password.updateValueAndValidity();
      this.form.controls.enabled.enable();
    }
  }

  public validateAndGetPayload(): SaveUserDto | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const raw = this.form.getRawValue();
    const payload: any = {
      person: raw.person,
      profile: raw.profile,
      email: raw.email.toLowerCase().trim(),
      enabled: raw.enabled
    };

    if (raw.password && raw.password.trim().length > 0) {
      payload.password = raw.password.trim();
    }

    return payload as SaveUserDto;
  }

  private buildForm(): FormGroup<UserFormControls> {
    return this.fb.group({
      person: this.fb.control<string>(USER_FORM_DEFAULTS.person, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      profile: this.fb.control<string>(USER_FORM_DEFAULTS.profile, {
        nonNullable: true,
        validators: [Validators.required]
      }),
      email: this.fb.control<string>(USER_FORM_DEFAULTS.email, {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: this.fb.control<string>(USER_FORM_DEFAULTS.password, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
      enabled: this.fb.control<boolean>(USER_FORM_DEFAULTS.enabled, {
        nonNullable: true
      })
    });
  }
}
