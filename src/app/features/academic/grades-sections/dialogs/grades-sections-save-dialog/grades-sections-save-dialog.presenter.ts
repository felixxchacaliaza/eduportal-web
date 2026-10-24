import { Injectable, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Classroom, Grade, GradeSectionService, GradeService, RuleService, Section } from '../../../../../core/api';
import { GradesSectionsSaveDialogData, GradesSectionsSavePayload } from './models/interfaces/grades-sections-save-dialog.interface';

/**
 * ============================================================================
 * GradesSectionsSaveDialogPresenter (Sub-Presenter de Diálogo)
 * ============================================================================
 * Administra el ciclo de vida del modal de creación/edición de Secciones.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS CLAVE:
 * 1. Scope Aislado y Ciclo de Vida Efímero:
 *    - Se provee en los `providers` de `GradesSectionsSaveDialogComponent`.
 *    - Nace al abrirse el diálogo y se destruye automáticamente al cerrarse.
 * 2. Filtrado de Recursos Físicos en Tiempo Real (`availableClassrooms`):
 *    - Aplica la regla de negocio de exclusión mutua de aulas físicas por turno.
 *    - Cuando el usuario cambia de turno en el selector, el `computed()` recalcula
 *      instantáneamente qué aulas están libres sin necesidad de peticiones HTTP extras.
 * 3. Consumo Dinámico de Reglas de Negocio:
 *    - Los turnos escolares no se codifican en duro; se consultan de la colección
 *      `rules` de MongoDB mediante `RuleService.getShifts('2026')`.
 * ============================================================================
 */
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

  // Turnos dinámicos consultados desde la colección 'rules' (key: 'SHIFTS')
  public readonly shifts = signal<readonly string[]>(['MAÑANA', 'TARDE']);

  // Turno seleccionado reactivo
  public readonly selectedShift = signal<string>(
    this.data.gradeSection?.shift || 'MAÑANA'
  );

  public readonly isSaving = signal<boolean>(false);
  public readonly isLoadingCatalog = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Computado reactivo: filtra y retorna EXCLUSIVAMENTE las aulas disponibles.
   * Si un aula ya está asignada a otra sección en el turno seleccionado, queda excluida de la lista.
   * Si estamos en modo 'edit', el aula asignada actualmente a esta misma sección sí se mantiene disponible.
   */
  public readonly availableClassrooms = computed<readonly Classroom[]>(() => {
    const classrooms = this.rawClassrooms();
    const currentShift = (this.selectedShift() || '').trim().toUpperCase();
    const existing = this.data.existingSections || [];
    const editingId = this.data.gradeSection?.id;

    // Conjunto de identificadores y nombres de aulas ocupadas en el turno seleccionado
    const occupiedClassroomIds = new Set<string>();
    const occupiedClassroomNames = new Set<string>();

    for (const s of existing) {
      const isDifferentSection = s.id !== editingId;
      const isActive = s.status === 'Activa';
      const isSameShift = (s.shift || '').trim().toUpperCase() === currentShift;

      if (isDifferentSection && isActive && isSameShift) {
        if (s.classroomId) {
          occupiedClassroomIds.add(String(s.classroomId));
        }
        if (s.classroomName && s.classroomName !== 'Sin Aula Asignada') {
          occupiedClassroomNames.add(s.classroomName.trim().toLowerCase());
        }
      }
    }

    // Filtrar para mostrar ÚNICAMENTE las aulas libres comparando por ID y por Nombre
    return classrooms.filter(c => {
      const id = String(c.id || (c as any)._id || '');
      const name = (c.name || '').trim().toLowerCase();

      const isOccupiedById = id ? occupiedClassroomIds.has(id) : false;
      const isOccupiedByName = name ? occupiedClassroomNames.has(name) : false;

      return !isOccupiedById && !isOccupiedByName;
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
      if (shifts && shifts.length > 0) {
        this.shifts.set(shifts);
        // Si el turno actual no existe en las reglas del año, seleccionar el primero:
        if (!shifts.includes(this.selectedShift())) {
          this.selectedShift.set(shifts[0]);
        }
      }
    } catch (error) {
      console.error('Error cargando catálogos para aperturar sección:', error);
      this.errorMessage.set('No se pudieron cargar los catálogos del aula o secciones.');
    } finally {
      this.isLoadingCatalog.set(false);
    }
  }

  public async save(payload: GradesSectionsSavePayload): Promise<void> {
    if (this.isSaving()) return;

    // Validación defensiva en frontend antes de enviar a API
    if (payload.classroom) {
      const isAvailable = this.availableClassrooms().some(c => {
        const id = String(c.id || (c as any)._id || '');
        return id === String(payload.classroom);
      });
      if (!isAvailable) {
        this.errorMessage.set(`El aula física ya está asignada a otro salón en el turno ${payload.shift} para el año lectivo 2026.`);
        return;
      }
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      if (this.data.mode === 'create') {
        const fullPayload = {
          ...payload,
          academicYear: '2026',
          enrolledCount: 0,
          enabled: true,
        };
        await this.gradeSectionService.createGradeSection(fullPayload as any);
      } else if (this.data.gradeSection?.id) {
        await this.gradeSectionService.updateGradeSection(this.data.gradeSection.id, payload as any);
      }

      this.dialogRef.close(true);
    } catch (error: any) {
      const msg = error?.error?.message || error?.message || 'Error al guardar la sección. Intente nuevamente.';
      this.errorMessage.set(msg);
    } finally {
      this.isSaving.set(false);
    }
  }

  public close(): void {
    this.dialogRef.close(false);
  }
}
