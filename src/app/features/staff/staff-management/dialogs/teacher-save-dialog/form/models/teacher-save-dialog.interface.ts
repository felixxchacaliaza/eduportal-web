import { ITeacher } from '../../../../models';

export interface TeacherSaveDialogData {
  mode: 'create' | 'edit';
  teacher?: ITeacher;
}
