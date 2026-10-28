import { IStudent } from '../../../../models';

/**
 * ============================================================================
 * StudentSaveDialogData Interface
 * ============================================================================
 * Payload inyectado en el diálogo modal mediante MAT_DIALOG_DATA.
 * ============================================================================
 */
export interface StudentSaveDialogData {
  mode: 'create' | 'edit';
  student?: IStudent;
}
