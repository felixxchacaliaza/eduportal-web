/**
 * Modelo de vista (ViewModel) para la representación de una asignatura en la UI.
 */
export interface SubjectItem {
  /** Identificador único UUID de la asignatura */
  readonly id: string;

  /** Código académico de la asignatura (ej. 'MAT-001', 'COM-001') */
  readonly code: string;

  /** Nombre formal de la materia */
  readonly name: string;

  /** Descripción u observaciones pedagógicas de la asignatura */
  readonly description?: string;

  /** Nombre del área curricular pedagógica asociada */
  readonly area: string;

  /** Identificador único (ObjectId) del área curricular asociada */
  readonly areaId: string;

  /** Carga lectiva semanal en horas pedagógicas */
  readonly hours: number;

  /** Estado operativo textual formateado para presentación ('Activa' | 'Desactiva') */
  readonly status: 'Activa' | 'Desactiva';

  /** Color hexadecimal distintivo para etiquetas de código */
  readonly color: string;
}
