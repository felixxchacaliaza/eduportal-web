// src/app/core/api/models/interfaces/menu-node.interface.ts
import { Menu } from './menu.interface';

/**
 * ============================================================================
 * MenuNode Interface
 * ============================================================================
 * Estructura jerárquica de menú que anida nodos hijos (Option Groups).
 * ============================================================================
 */
export interface MenuNode extends Menu {
  readonly children?: readonly MenuNode[];
}
