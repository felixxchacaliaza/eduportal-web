import { Injectable, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Classroom, Grade, GradeSectionService, GradeService, RuleService, Section } from '../../../../../core/api';
import { GradesSectionsSaveDialogData, GradesSectionsSavePayload } from './models/interface/grades-sections-save-dialog.interface';

@Injectable()
export class GradesSectionsSaveDialogPresenter {
  private readonly dialogRef = inject(MatDialogRef<any>);
  public readonly data = inject<GradesSectionsSaveDialogData>(MAT_DIALOG_DATA);
  private readonly gradeSectionService = inject(GradeSectionService);
  private readonly gradeService = inject(GradeService);
  private readonly ruleService = inject(RuleService);

  public readonly grades = signal<readonly Grade[]>([]);
  public readonly sections = signal<readonly Section[]>([]);
  public readonly rawClassrooms = signal<readonly Classroom[]>([]);
  public readonly shifts = signal<readonly string[]>(['MAÑANA', 'TARDE']);

  public readonly selectedShift = signal<string>(this.data.gradeSection?.shift || 'MAÑANA');
  public readonly isSaving = signal<boolean>(false);
  public readonly isLoadingCatalog = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly availableClassrooms = computed<readonly Classroom[]>(() => {
    const classrooms = this.rawClassrooms();
    const currentShift = (this.selectedShift() || '').trim().toUpperCase();
    const existing = this.data.existingSections || [];
    const editingId = this.data.gradeSection?.id;

    const occupiedIds = new Set<string>();
    const occupiedNames = new Set<string>();

    for (const s of existing) {
      if (s.id !== editingId && s.status === 'Activa' && (s.shift || '').trim().toUpperCase() === currentShift) {
        if (s.classroomId) occupiedIds.add(String(s.classroomId));
        if (s.classroomName && s.classroomName !== 'Sin Aula Asignada') occupiedNames.add(s.classroomName.trim().toLowerCase());
      }
    }

    return classrooms.filter(c => {
      const id = String(c.id || (c as any)._id || '');
      const name = (c.name || '').trim().toLowerCase();
      return !occupiedIds.has(id) && !occupiedNames.has(name);
    });
  });

  constructor() {
    this.loadCatalogs();
  }

  public setShift(shift: string): void {
    this.selectedShift.set(shift);
  }

  public async loadCatalogs(): Promise<void> {
    this.isLoadingCatalog.set(true);
    try {
      const [grades, sections, classrooms, shifts] = await Promise.all([
        this.gradeService.getGrades(),
        this.gradeSectionService.getSections(),
        this.gradeSectionService.getClassrooms(),
        this.ruleService.getShifts('2026'),
      ]);
      this.grades.set(grades.filter(g => g.enabled));
      this.sections.set(sections.filter(s => s.enabled));
      this.rawClassrooms.set(classrooms.filter(c => c.enabled));
      if (shifts?.length) {
        this.shifts.set(shifts);
        if (!shifts.includes(this.selectedShift())) this.selectedShift.set(shifts[0]);
      }
    } catch {
      this.errorMessage.set('Error al cargar catálogos.');
    } finally {
      this.isLoadingCatalog.set(false);
    }
  }

  public async save(payload: GradesSectionsSavePayload): Promise<void> {
    if (this.isSaving()) return;
    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      if (this.data.mode === 'create') {
        await this.gradeSectionService.createGradeSection({ ...payload, academicYear: '2026', enabled: true } as any);
      } else if (this.data.gradeSection?.id) {
        await this.gradeSectionService.updateGradeSection(this.data.gradeSection.id, payload as any);
      }
      this.dialogRef.close(true);
    } catch (error: any) {
      this.errorMessage.set(error?.error?.message || 'Error al guardar.');
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close(false);
  }
}