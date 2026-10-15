import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../../../shared/layout/navbar/navbar.component';
import { SidebarComponent } from '../../../shared/layout/sidebar/sidebar.component';
import { MainLayoutPresenter } from './main-layout.presenter';

/**
 * ============================================================================
 * MainLayoutComponent
 * ============================================================================
 * Componente contenedor estructural principal (App Shell Layout).
 *
 * @remarks
 * Provee el marco visual global de la aplicación (navbar, sidebar colapsable,
 * breadcrumbs dinámicos y proyección de vistas con `<router-outlet>`).
 * Delega toda la lógica de enrutamiento y estado a {@link MainLayoutPresenter}.
 * ============================================================================
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, MatIconModule],
  providers: [MainLayoutPresenter],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  /** Presentador del layout principal */
  public readonly presenter = inject(MainLayoutPresenter);
}
