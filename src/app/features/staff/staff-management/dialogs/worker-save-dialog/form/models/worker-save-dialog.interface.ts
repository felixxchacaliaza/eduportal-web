import { IWorker } from '../../../../models';

export interface WorkerSaveDialogData {
  mode: 'create' | 'edit';
  worker?: IWorker;
}
