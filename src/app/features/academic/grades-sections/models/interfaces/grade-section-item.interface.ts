/**
 * ============================================================================
 * GradeSectionItem (View Model / UI Contract)
 * ============================================================================
 * Modelo aplanado de datos diseñado específicamente para el renderizado eficiente
 * de la tabla de secciones en la interfaz de usuario.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * - Evita lidiar con objetos anidados o no tipados de MongoDB en el HTML.
 * - Desacopla la forma en que la BD almacena los datos de cómo la vista los consume.
 * - Todas las propiedades son `readonly` para preservar la inmutabilidad de las Signals.
 * ============================================================================
 */
export interface GradeSectionItem {
  /** Identificador único del registro */
  readonly id: string;
  /** Código único de la sección (ej. 'SEC-1A-2026') */
  readonly code: string;
  /** ID del grado escolar */
  readonly gradeId: string;
  /** Nombre formateado del grado (ej. '1° Secundaria') */
  readonly gradeName: string;
  /** ID de la sección alfabética */
  readonly sectionId: string;
  /** Nombre de la sección (ej. 'A') */
  readonly sectionName: string;
  /** ID del aula física asignada (opcional si aún no tiene) */
  readonly classroomId?: string;
  /** Nombre del aula física (ej. 'Aula 101') */
  readonly classroomName: string;
  /** Turno escolar ('MAÑANA' o 'TARDE') */
  readonly shift: string;
  /** Aforo máximo de estudiantes normado */
  readonly maxCapacity: number;
  /** Estado operativo ('Activa' o 'Desactiva') */
  readonly status: 'Activa' | 'Desactiva';
}
