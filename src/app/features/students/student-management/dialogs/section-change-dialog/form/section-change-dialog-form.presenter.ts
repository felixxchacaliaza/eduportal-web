import { Injectable, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SectionChangeDialogFormModel } from './models/section-change-dialog-form.model';
import { SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT } from './models/section-change-dialog-form.model.constant';
import { IGradeSectionSummary } from '../../../models';

/**
 * ============================================================================
 * SectionChangeDialogFormPresenter
 * ============================================================================
 * Presentador de formulario scoped para el modal de cambio de sección escolar.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class SectionChangeDialogFormPresenter {
  private readonly fb = inject(FormBuilder);

  public readonly formModel = new SectionChangeDialogFormModel();
  public readonly constant = SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT;

  public readonly form: FormGroup;
  public readonly availableSections = signal<IGradeSectionSummary[]>([]);
  public readonly selectedSectionId = signal<string>('');
  public readonly currentSectionId = signal<string>('');

  public readonly selectedSection = computed(() => {
    const id = this.selectedSectionId();
    if (!id) return null;
    return this.availableSections().find(s => s.id === id) || null;
  });

  public readonly hasVacancies = computed(() => {
    const section = this.selectedSection();
    if (!section) return false;
    return (section.availableVacancies ?? 0) > 0;
  });

  public readonly isSameSection = computed(() => {
    const selected = this.selectedSectionId();
    const current = this.currentSectionId();
    return !!selected && !!current && selected === current;
  });

  constructor() {
    this.form = this.fb.group({
      gradeSection: this.formModel.gradeSection
    });

    this.form.get('gradeSection')?.valueChanges.subscribe(val => {
      this.selectedSectionId.set(val || '');
    });
  }

  public initialize(sections: IGradeSectionSummary[], currentGradeSectionId: string): void {
    this.availableSections.set(sections);
    this.currentSectionId.set(currentGradeSectionId);
  }

  public isValid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    if (this.isSameSection()) {
      return false;
    }
    return this.hasVacancies();
  }

  public getErrorMessage(controlName: string): string {
    return this.formModel.getErrorMessage(controlName, this.form).error;
  }

  public getSelectedSectionId(): string {
    return String(this.form.value.gradeSection).trim();
  }
}
