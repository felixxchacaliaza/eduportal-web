// src/app/shared/layout/sidebar/models/navigation-item.interface.ts
import { NavigationSubItem } from './navigation-sub-item.interface';

/**
 * ============================================================================
 * NavigationItem Interface
 * ============================================================================
 * Opción de primer nivel del Sidebar (Option Group desplegable u opción directa).
 * ============================================================================
 */
export interface NavigationItem {
  readonly label: string;
  readonly icon: string;
  readonly path?: string;
  readonly badge?: string;
  readonly children?: readonly NavigationSubItem[];
}
