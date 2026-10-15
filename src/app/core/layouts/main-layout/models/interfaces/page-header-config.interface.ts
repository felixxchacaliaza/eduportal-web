/**
 * ============================================================================
 * PageHeaderConfig Interface
 * ============================================================================
 * Contrato de configuración para la cabecera dinámica de una ruta en el layout principal.
 *
 * @remarks
 * Define el título, icono, descripción y migas de pan (breadcrumbs) que
 * se proyectan en el encabezado de cada página del portal educativo.
 * ============================================================================
 */
export interface PageHeaderConfig {
  /** Ruta base asociada a la vista (ej. '/asignaturas', '/dashboard') */
  readonly route: string;

  /** Migas de pan descriptivas para navegación contextual */
  readonly breadcrumbs: readonly string[];

  /** Título principal de la página */
  readonly title: string;

  /** Nombre del icono de Angular Material representativo */
  readonly icon: string;

  /** Descripción o alcance pedagógico de la vista */
  readonly description: string;
}

