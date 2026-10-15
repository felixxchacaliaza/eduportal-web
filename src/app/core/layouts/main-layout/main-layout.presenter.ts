import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { PageHeaderConfig } from './models/interfaces/page-header-config.interface';
import { PAGE_HEADERS_CONSTANT } from './models/constants/page-headers.constant';

/**
 * ============================================================================
 * MainLayoutPresenter
 * ============================================================================
 * Presentador maestro para la gestión del layout estructural de la aplicación.
 *
 * @remarks
 * Encapsula:
 * - **Estado del Menú Lateral:** Señal reactiva `isSidebarCollapsed` y método `toggleSidebar()`.
 * - **Enrutamiento Reactivo:** Detección de cambios de URL mediante RxJS y resolución
 *   automática de la cabecera correspondiente (`currentHeader`) desde {@link PAGE_HEADERS_CONSTANT}.
 * ============================================================================
 */
@Injectable()
export class MainLayoutPresenter {
  private readonly router = inject(Router);

  /** Catálogo inmutable de cabeceras de página */
  public readonly pageHeaders: readonly PageHeaderConfig[] = PAGE_HEADERS_CONSTANT;

  /** Estado reactivo local que gestiona si el menú lateral está colapsado */
  public readonly isSidebarCollapsed = signal<boolean>(false);

  /** Señal reactiva que calcula la cabecera activa en función de la ruta actual */
  public readonly currentHeader = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects || e.url),
      startWith(this.router.url),
      map(url => {
        const cleanUrl = url.split('?')[0].split('#')[0];
        return (
          this.pageHeaders.find(
            h => cleanUrl === h.route || cleanUrl.startsWith(h.route + '/')
          ) ?? null
        );
      })
    )
  );

  /**
   * Invierte el estado de colapso del menú lateral.
   */
  public toggleSidebar(): void {
    this.isSidebarCollapsed.update(prev => !prev);
  }
}

