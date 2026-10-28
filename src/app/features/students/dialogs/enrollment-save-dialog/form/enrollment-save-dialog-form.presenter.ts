import { Injectable, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnrollmentSaveDialogFormModel } from './models/enrollment-save-dialog-form.model';
import { ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT } from './models/enrollment-save-dialog-form.model.constant';
import { IEnrollStudentRequestDto, IGradeSectionSummary } from '../../../models';

/**
 * ============================================================================
 * EnrollmentSaveDialogFormPresenter
 * ============================================================================
 * Presentador de formulario scoped para el modal de matrícula anual.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class EnrollmentSaveDialogFormPresenter {
  private readonly fb = inject(FormBuilder);

  public readonly formModel = new EnrollmentSaveDialogFormModel();
  public readonly enrollmentConstant = ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT;

  public readonly form: FormGroup;
  public readonly availableSections = signal<IGradeSectionSummary[]>([]);
  public readonly selectedSectionId = signal<string>('');

  public readonly selectedSection = computed(() => {
    const id = this.selectedSectionId();
    if (!id) return null;
    return this.availableSections().find(s => s._id === id || s.id === id) || null;
  });

  public readonly hasVacancies = computed(() => {
    const section = this.selectedSection();
    if (!section) return true;
    return section.availableVacancies > 0;
  });

  constructor() {
    this.form = this.fb.group({
      gradeSection: this.formModel.gradeSection,
      academicYear: this.formModel.academicYear,
      status: this.formModel.status,
      observation: this.formModel.observation
    });

    this.form.get('gradeSection')?.valueChanges.subscribe(val => {
      this.selectedSectionId.set(val || '');
    });
  }

  /**
   * Inicializa las secciones disponibles y valores predeterminados.
   */
  public initialize(sections: IGradeSectionSummary[]): void {
    this.availableSections.set(sections);
    if (sections.length > 0) {
      // Si hay al menos una sección con vacante disponible, pre-seleccionar
      const firstWithVacancy = sections.find(s => s.availableVacancies > 0);
      if (firstWithVacancy) {
        const id = firstWithVacancy._id || firstWithVacancy.id;
        this.form.patchValue({ gradeSection: id });
        this.selectedSectionId.set(id);
      }
    }
  }

  /**
   * Obtiene el mensaje de error de un control.
   */
  public getErrorMessage(controlName: string): string {
    return this.formModel.getErrorMessage(controlName, this.form).error;
  }

  /**
   * Valida si el formulario es apto para proceder con la matrícula.
   */
  public isValid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }

    // Regla de Negocio RN-MAT-01: No matricular si aforo superado (vacantes <= 0)
    if (!this.hasVacancies()) {
      return false;
    }

    return true;
  }

  /**
   * Construye el payload tipado para el API de matrícula.
   */
  public getPayload(studentId: string): IEnrollStudentRequestDto {
    const raw = this.form.value;
    return {
      student: studentId,
      gradeSection: String(raw.gradeSection).trim(),
      academicYear: String(raw.academicYear).trim(),
      status: raw.status || 'DEFINITIVA',
      observation: raw.observation ? String(raw.observation).trim() : undefined
    };
  }
}
