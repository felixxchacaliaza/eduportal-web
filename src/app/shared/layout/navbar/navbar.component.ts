import { Component, output, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/services/auth.service';

/**
 * ============================================================================
 * NavbarComponent
 * ============================================================================
 * Barra de navegación superior corporativa.
 * Muestra el perfil del usuario autenticado, estado del año lectivo y acción de logout.
 * ============================================================================
 */
@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public readonly authService = inject(AuthService);

  /** Emisor de evento funcional hacia el padre para alternar el menú lateral */
  public readonly toggleSidebar = output<void>();

  /** Iniciales reactivas del usuario autenticado para el avatar */
  public readonly userInitials = computed<string>(() => {
    const fullName = this.authService.userFullName();
    if (!fullName) {
      return 'EP';
    }
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  });

  public onToggleClick(): void {
    this.toggleSidebar.emit();
  }
}
