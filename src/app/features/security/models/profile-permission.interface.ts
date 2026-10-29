/**
 * ============================================================================
 * ProfilePermission & AccessLevel Interfaces
 * ============================================================================
 * Define el nivel de acceso granular (FULL, READ_ONLY o NONE) sobre un menú.
 * ============================================================================
 */
export type AccessLevel = 'FULL' | 'READ_ONLY' | 'NONE';

export interface ProfilePermission {
  readonly menu: string | {
    readonly id?: string;
    readonly _id?: string;
    readonly label?: string;
    readonly icon?: string;
    readonly path?: string;
    readonly key?: string;
  };
  readonly accessLevel: 'FULL' | 'READ_ONLY';
}
