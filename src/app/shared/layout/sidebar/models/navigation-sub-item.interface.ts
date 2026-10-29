// src/app/shared/layout/sidebar/models/navigation-sub-item.interface.ts

/**
 * ============================================================================
 * NavigationSubItem Interface
 * ============================================================================
 * Opción hija que pertenece a un grupo desplegable en el Sidebar.
 * ============================================================================
 */
export interface NavigationSubItem {
  readonly path: string;
  readonly label: string;
  readonly icon?: string;
  readonly badge?: string;
}
