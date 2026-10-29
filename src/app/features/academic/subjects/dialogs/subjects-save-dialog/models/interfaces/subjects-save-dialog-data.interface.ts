import { SubjectItem } from '../../../../subjects.presenter';
import { FilterOption } from '../../../../components/subjects-filters/models/interfaces/filter-option.interface';

export interface SubjectsSaveDialogData {
  readonly mode: 'create' | 'edit';
  readonly subject?: SubjectItem;
  readonly areas: readonly FilterOption[];
}