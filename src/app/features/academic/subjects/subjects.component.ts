import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  SubjectsCardsComponent,
  SubjectsFiltersComponent,
  SubjectsTableComponent,
} from './components';
import { SubjectsSaveDialogComponent } from './dialogs/subjects-save-dialog/subjects-save-dialog.component';
import { SubjectsPresenter } from './subjects.presenter';
import { SubjectsFilterState } from './components/subjects-filters/models/interfaces/subjects-filter-state.interface';

/**
 * Componente principal (Smart Component / Container) del módulo de Asignaturas.
 *
 * @remarks
 * Implementa el patrón **Smart-Dumb Component** en conjunto con {@link SubjectsPresenter}:
 * - **Smart Component (SubjectsComponent):** Inyecta el presenter y actúa como director de orquesta.
 *   Distribuye el estado hacia los componentes hijos mediante `input()` y reacciona a sus
 *   interacciones mediante `output()`.
 * - **Dumb Components:**
 *   - `SubjectsCardsComponent`: Recibe `cards()`.
 *   - `SubjectsFiltersComponent`: Recibe `areas()`, emite `(filterChange)` y `(create)`.
 *   - `SubjectsTableComponent`: Recibe `filteredSubjects()`, emite `(toggleStatus)` y `(edit)`.
 * - **Modal de Guardado:** Abre {@link SubjectsSaveDialogComponent} para crear y editar asignaturas.
 */
@Component({
  selector: 'app-subjects',
  imports: [
    MatDialogModule,
    SubjectsCardsComponent,
    SubjectsFiltersComponent,
    SubjectsTableComponent,
  ],
  providers: [SubjectsPresenter],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectsComponent {
  /** Inyección del presentador maestro y fuente única de verdad */
  private readonly presenter = inject(SubjectsPresenter);

  /** Servicio de Angular Material para la apertura de diálogos modales */
  private readonly dialog = inject(MatDialog);

  /** Datos reactivos para las tarjetas métricas superiores */
  public readonly cards = this.presenter.cards;

  /** Opciones de áreas curriculares para el componente de filtros */
  public readonly areas = this.presenter.areas;

  /** Asignaturas filtradas reactivamente para el componente de tabla */
  public readonly filteredSubjects = this.presenter.filteredSubjects;

  /**
   * Propaga los cambios de filtros consolidados hacia el presentador maestro.
   */
  public onFilterChange(filters: SubjectsFilterState): void {
    this.presenter.applyFilters(filters);
  }

  /**
   * Alterna el estado operativo de una asignatura seleccionada en la tabla.
   */
  public onToggleStatus(id: string): void {
    this.presenter.toggleSubjectStatus(id);
  }

  /**
   * Abre el diálogo modal en modo edición para modificar una asignatura existente.
   */
  public onEditSubject(id: string): void {
    const subject = this.presenter.subjects().find(item => item.id === id);
    if (!subject) return;

    const dialogRef = this.dialog.open(SubjectsSaveDialogComponent, {
      width: '580px',
      data: {
        mode: 'edit',
        subject,
        areas: this.areas(),
      },
    });

    dialogRef.afterClosed().subscribe((saved: boolean | undefined) => {
      if (saved) {
        this.presenter.loadSubjects();
      }
    });
  }

  /**
   * Abre el diálogo modal en modo creación para registrar una nueva asignatura.
   */
  public handleCreateSubject(): void {
    const dialogRef = this.dialog.open(SubjectsSaveDialogComponent, {
      width: '580px',
      data: {
        mode: 'create',
        areas: this.areas(),
      },
    });

    dialogRef.afterClosed().subscribe((saved: boolean | undefined) => {
      if (saved) {
        this.presenter.loadSubjects();
      }
    });
  }
}
