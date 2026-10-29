import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * ============================================================================
 * AuthLayoutComponent
 * ============================================================================
 * Shell estructural dedicado a los flujos públicos y de autenticación (Login,
 * Recuperación de Contraseña, etc.).
 *
 * @remarks
 * Provee un lienzo limpio a pantalla completa sin elementos persistentes
 * de administración (sin Navbar superior ni Sidebar lateral).
 * ============================================================================
 */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {}
