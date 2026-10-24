/**
 * ============================================================================
 * GradesSectionsFilterState (View Model / UI Contract)
 * ============================================================================
 * Representa el estado reactivo e inmutable de los filtros de la pantalla.
 *
 * @remarks
 * Administrado por `GradesSectionsPresenter.filterState` (Signal).
 * ============================================================================
 */
export interface GradesSectionsFilterState {
  /** ID del grado escolar seleccionado o 'ALL' para mostrar todos */
  readonly gradeId: string;
  /** Filtro de estado: 'ALL' (todos), 'ACTIVE' (activas), 'INACTIVE' (desactivas) */
  readonly status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  /** Cadena de búsqueda en tiempo real (coincide con aula, sección o grado) */
  readonly search: string;
}
