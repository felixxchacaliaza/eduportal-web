// src/app/shared/components/sidebar/sidebar.component.ts
import { Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface NavigationSubItem {
  readonly path: string;
  readonly label: string;
  readonly icon?: string;
  readonly badge?: string;
}

export interface NavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly path?: string;
  readonly badge?: string;
  readonly children?: readonly NavigationSubItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  // Signal input reactivo recibido desde el componente padre:
  public readonly isCollapsed = input<boolean>(false);

  // Control de grupos desplegados (inicia abierto 'Académico'):
  public readonly openGroups = signal<Set<string>>(new Set(['Académico']));

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

  // Lista tipada de navegación escolar:
  public readonly navItems: readonly NavigationItem[] = [
    { path: '/dashboard', label: 'Panel de Control', icon: 'dashboard' },
    { path: '/alumnos', label: 'Padrón de Alumnos', icon: 'people', badge: '100' },
    {
      label: 'Académico',
      icon: 'school',
      children: [
        { path: '/grados-secciones', label: 'Grados-Secciones', icon: 'class' },
        { path: '/grados-asignaturas', label: 'Grados-Asignaturas', icon: 'auto_stories' },
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
    },
    { path: '/notas', label: 'Calificaciones', icon: 'grade' }
  ];
}
