// src/app/core/api/models/interfaces/menu.interface.ts

/**
 * ============================================================================
 * Menu Interface
 * ============================================================================
 * Representa un registro de navegación en el catálogo de menús de MongoDB.
 * ============================================================================
 */
export interface Menu {
  readonly id: string;
  readonly code: string;
  readonly key: string;
  readonly label: string;
  readonly icon: string;
  readonly path: string | null;
  readonly parent: string | null;
  readonly order: number;
  readonly enabled: boolean;
}
