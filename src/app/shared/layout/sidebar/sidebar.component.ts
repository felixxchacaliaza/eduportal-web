import { Component, input, signal, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../../core/api/services/menu.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { NavigationItem } from './models/navigation-item.interface';

/**
 * ============================================================================
 * SidebarComponent
 * ============================================================================
 * Menú lateral de navegación con soporte de RBAC dinámico desde AuthService.
 * ============================================================================
 */
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly menuService = inject(MenuService);
  private readonly authService = inject(AuthService);

  /** Signal input reactivo recibido desde el componente padre */
  public readonly isCollapsed = input<boolean>(false);

  /** Opción para recibir items personalizados por input binding si fuera requerido */
  public readonly itemsInput = input<readonly NavigationItem[] | null>(null, { alias: 'navItems' });

  /** Control de grupos desplegados (inicia abierto 'Gestión Académica' y 'Mantenimiento') */
  public readonly openGroups = signal<Set<string>>(new Set(['Gestión Académica', 'Académico', 'Mantenimiento']));

  /**
   * Catálogo reactivo de navegación escolar:
   * Prioriza el input directo, luego los datos del usuario autenticado (RBAC en AuthService),
   * posteriormente los datos del MenuService (MongoDB), y como fallback el catálogo base.
   */
  public readonly navItems = computed<readonly NavigationItem[]>(() => {
    const inputVal = this.itemsInput();
    if (inputVal && inputVal.length > 0) {
      return inputVal;
    }
    const fromAuth = this.authService.navigationItems();
    if (fromAuth && fromAuth.length > 0) {
      return fromAuth;
    }
    const fromService = this.menuService.navigationItems();
    if (fromService && fromService.length > 0) {
      return fromService;
    }
    return this.fallbackNavItems;
  });

  public toggleGroup(label: string): void {
    const current = new Set(this.openGroups());
    if (current.has(label)) {
      current.delete(label);
    } else {
      current.add(label);
    }
    this.openGroups.set(current);
  }

  public isGroupOpen(label: string): boolean {
    return this.openGroups().has(label);
  }

  /** Catálogo de respaldo estático en caso de desconexión momentánea de la API: */
  private readonly fallbackNavItems: readonly NavigationItem[] = [
    { path: '/dashboard', label: 'Panel de Control', icon: 'dashboard' },
    {
      label: 'Gestión Académica',
      icon: 'school',
      children: [
        { path: '/grados-secciones', label: 'Salones y Secciones', icon: 'class' },
        { path: '/grados-asignaturas', label: 'Malla Curricular', icon: 'auto_stories' },
        { path: '/asignaturas', label: 'Asignaturas', icon: 'menu_book' },
      ]
    },
    {
      label: 'Mantenimiento',
      icon: 'tune',
      children: [
        { path: '/niveles', label: 'Niveles Educativos', icon: 'layers' },
        { path: '/areas', label: 'Áreas Curriculares', icon: 'category' },
      ]
    }
  ];
}
