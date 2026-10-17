import { SubjectItem } from '../../../../subjects.presenter';
import { FilterOption } from '../../../../components/subjects-filters/models/interfaces/filter-option.interface';

/**
 * ============================================================================
 * SubjectsSaveDialogData Interface
 * ============================================================================
 * Contrato de datos inyectados en el diálogo modal a través del token `MAT_DIALOG_DATA`.
 *
 * @remarks
 * Provee al diálogo {@link SubjectsSaveDialogComponent} y a su presentador
 * {@link SubjectsSaveDialogPresenter} el contexto necesario para determinar
 * si la operación corresponde a un alta nueva o a la modificación de un registro.
 * ============================================================================
 */
export interface SubjectsSaveDialogData {
  /**
   * Modo operativo de apertura del diálogo:
   * - `'create'`: Formulario en blanco para registrar una nueva asignatura.
   * - `'edit'`: Formulario precargado con los datos del registro seleccionado.
   */
  readonly mode: 'create' | 'edit';

  /**
   * Datos de la asignatura a modificar (obligatorio cuando `mode === 'edit'`).
   */
  readonly subject?: SubjectItem;

  /**
   * Catálogo de opciones de áreas curriculares activas para alimentar el `<mat-select>`.
   */
  readonly areas: readonly FilterOption[];
}
