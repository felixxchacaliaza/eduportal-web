import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginPresenter } from './login.presenter';
import { AuthService } from '../../../../core/auth/services/auth.service';

/**
 * ============================================================================
 * LoginComponent
 * ============================================================================
 * Vista principal de autenticación con arquitectura Form Triad y Signals.
 * Permite a directivos, docentes y administradores acceder al sistema EduPortal.
 * ============================================================================
 */
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  providers: [LoginPresenter],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public readonly presenter = inject(LoginPresenter);
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * Procesa el envío del formulario de inicio de sesión.
   */
  public async onSubmit(): Promise<void> {
    const credentials = this.presenter.validateAndGetCredentials();
    if (!credentials) {
      return;
    }

    try {
      await this.authService.login({
        email: credentials.email,
        password: credentials.password
      });

      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      await this.router.navigateByUrl(returnUrl);
    } catch (err: any) {
      const message =
        err?.error?.message ||
        err?.message ||
        'Credenciales inválidas. Verifique su correo y contraseña.';
      this.presenter.setErrorMessage(message);
    }
  }

  /**
   * Facilita la selección rápida de credenciales predefinidas para pruebas de evaluación.
   */
  public fillRole(role: 'admin' | 'director' | 'docente'): void {
    if (role === 'admin') {
      this.presenter.fillCredentials('root@eduportal.edu.pe', 'Admin123*');
    } else if (role === 'director') {
      this.presenter.fillCredentials('director@eduportal.edu.pe', 'Director123*');
    } else if (role === 'docente') {
      this.presenter.fillCredentials('docente@eduportal.edu.pe', 'Docente123*');
    }
  }
}
