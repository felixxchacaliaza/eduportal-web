/**
 * ============================================================================
 * SubjectsSaveFormPayload Interface
 * ============================================================================
 * DTO (Data Transfer Object) inmutable que encapsula los datos validados
 * y listos para persistir mediante llamadas HTTP (POST / PUT) hacia la API.
 *
 * @remarks
 * Emitido por {@link SubjectsSaveDialogFormComponent} y consumido por
 * {@link SubjectsSaveDialogPresenter.save} para enviar la petición a {@link SubjectService}.
 * ============================================================================
 */
export interface SubjectsSaveFormPayload {
  /** Nombre normalizado y sin espacios superfluos de la asignatura */
  readonly name: string;

  /** Identificador o nombre del área curricular académica */
  readonly area: string;

  /** Horas semanales validadas (número entero entre 1 y 20) */
  readonly weeklyHours: number;

  /** Observaciones pedagógicas o competencias de la asignatura (opcional) */
  readonly description?: string;

  /** Estado operativo de disponibilidad de la materia (opcional, asignado automáticamente) */
  readonly enabled?: boolean;
}
