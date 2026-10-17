/**
 * ============================================================================
 * SubjectsSaveDialogFormModelInterface
 * ============================================================================
 * Contrato de tipado estricto para los valores en bruto del formulario
 * de creación y edición de asignaturas (`getRawValue()`).
 *
 * @remarks
 * Representa la estructura de datos capturada por {@link SubjectsSaveDialogFormModel}
 * antes de su transformación final a {@link SubjectsSaveFormPayload}.
 * ============================================================================
 */
export interface SubjectsSaveDialogFormModelInterface {
  /** Nombre descriptivo de la asignatura escolar */
  name?: string;

  /** Identificador o nombre del área curricular a la que pertenece */
  area?: string;

  /** Carga horaria semanal asignada a la materia (1 - 20 horas) */
  weeklyHours?: number;

  /** Observaciones, competencias o descripción pedagógica (opcional) */
  description?: string;
}
