import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginFormControls, LoginFormValue } from './models/login-form.model';
import { LOGIN_FORM_DEFAULTS } from './models/login-form.constant';

/**
 * ============================================================================
 * LoginPresenter
 * ============================================================================
 * Cerebro desacoplado (Headless Presenter) para la pantalla de inicio de sesión.
 * Encapsula la reactividad del formulario tipado, validaciones y estado visual.
 * ============================================================================
 */
@Injectable()
export class LoginPresenter {
  private readonly fb = inject(FormBuilder);

  /** Formulario reactivo tipado */
  public readonly form: FormGroup<LoginFormControls> = this.buildForm();

  /** Control de visibilidad del campo contraseña */
  public readonly hidePassword = signal<boolean>(true);

  /** Mensaje de error reactivo (credenciales inválidas, bloqueo, etc.) */
  public readonly errorMessage = signal<string | null>(null);

  /** Alterna la máscara del campo de contraseña */
  public togglePasswordVisibility(): void {
    this.hidePassword.update(prev => !prev);
  }

  /** Asigna o limpia el mensaje de error del formulario */
  public setErrorMessage(message: string | null): void {
    this.errorMessage.set(message);
  }

  /** Carga credenciales en el formulario (usado para selectores rápidos de prueba) */
  public fillCredentials(email: string, password: string): void {
    this.form.patchValue({ email, password });
    this.form.markAsDirty();
    this.errorMessage.set(null);
  }

  /**
   * Valida el formulario y retorna su valor tipado si es válido;
   * de lo contrario marca todos los controles como tocados y retorna null.
   */
  public validateAndGetCredentials(): LoginFormValue | null {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }
    return this.form.getRawValue();
  }

  /**
   * Construye el FormGroup inmutable con validaciones síncronas requeridas.
   */
  private buildForm(): FormGroup<LoginFormControls> {
    return this.fb.group({
      email: this.fb.control<string>(LOGIN_FORM_DEFAULTS.email, {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: this.fb.control<string>(LOGIN_FORM_DEFAULTS.password, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
      rememberMe: this.fb.control<boolean>(LOGIN_FORM_DEFAULTS.rememberMe, {
        nonNullable: true
      })
    });
  }
}
