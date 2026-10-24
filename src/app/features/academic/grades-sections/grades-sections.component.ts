import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { GradesSectionsPresenter } from './grades-sections.presenter';
import { GradesSectionsCardsComponent } from './components/grades-sections-cards/grades-sections-cards.component';
import { GradesSectionsFiltersComponent } from './components/grades-sections-filters/grades-sections-filters.component';
import { GradesSectionsTableComponent } from './components/grades-sections-table/grades-sections-table.component';
import { GradesSectionsFilterState } from './models/interfaces/grades-sections-filter-state.interface';
import { GradeSectionItem } from './models/interfaces/grade-section-item.interface';
import { GradesSectionsSaveDialogComponent } from './dialogs/grades-sections-save-dialog/grades-sections-save-dialog.component';
import { GradesSectionsSaveDialogData } from './dialogs/grades-sections-save-dialog/models/interfaces/grades-sections-save-dialog.interface';

/**
 * ============================================================================
 * GradesSectionsComponent (Smart Component / Container)
 * ============================================================================
 * Componente orquestador del módulo de Grados y Secciones.
 *
 * @remarks
 * Aplica el patrón Smart-Dumb en coordinación con {@link GradesSectionsPresenter}:
 * 1. Expone las Signals de solo lectura del Presenter hacia la vista (`cards`, `grades`, `filteredSections`, etc.).
 * 2. Recibe los eventos del DOM emitidos por los componentes Dumb hijos (`output()`).
 * 3. Gestiona la capa visual y apertura de modales (`MatDialog`).
 * 4. Delega la ejecución de la lógica y efectos al Presenter correspondiente.
 * ============================================================================
 */
@Component({
  selector: 'app-grades-sections',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    GradesSectionsCardsComponent,
    GradesSectionsFiltersComponent,
    GradesSectionsTableComponent,
  ],
  providers: [GradesSectionsPresenter],
  templateUrl: './grades-sections.component.html',
  styleUrl: './grades-sections.component.scss',
})
export class GradesSectionsComponent {
  /** Presentador maestro que administra el estado reactivo y operaciones */
  private readonly presenter = inject(GradesSectionsPresenter);
  /** Servicio de diálogos de Material para orquestar la apertura modal */
  private readonly dialog = inject(MatDialog);

  // --------------------------------------------------------------------------
  // Signals expuestas para el Template (Data Top-Down)
  // --------------------------------------------------------------------------
  public readonly cards = this.presenter.cards;
  public readonly grades = this.presenter.grades;
  public readonly filterState = this.presenter.filterState;
  public readonly filteredSections = this.presenter.filteredSections;
  public readonly isLoading = this.presenter.isLoading;

  // --------------------------------------------------------------------------
  // Métodos manejadores de eventos (Bottom-Up)
  // --------------------------------------------------------------------------

  /**
   * Recibe el nuevo estado de filtros desde `GradesSectionsFiltersComponent`
   * y lo delega al Presenter para recalcular la tabla.
   */
  public onFilterChange(filters: GradesSectionsFilterState): void {
    this.presenter.applyFilters(filters);
  }

  /**
   * Recibe la orden de aperturar una nueva sección desde la barra de filtros.
   */
  public onCreateSection(): void {
    this.openSaveDialog();
  }

  /**
   * Recibe la orden de editar una sección desde la tabla.
   */
  public onEditSection(item: GradeSectionItem): void {
    this.openSaveDialog(item);
  }

  /**
   * Recibe el identificador de la sección para alternar su estado activo/inactivo.
   */
  public onToggleStatus(id: string): void {
    this.presenter.toggleSectionStatus(id);
  }

  /**
   * Orquesta la apertura del modal de creación/edición en la capa de UI.
   *
   * @remarks
   * CONCEPTOS PEDAGÓGICOS:
   * 1. MatDialog en el Componente (No en el Presenter):
   *    - Mantiene al Presenter 100% headless (sin referencias a vistas ni overlays).
   * 2. Inyección de `existingSections`:
   *    - Le pasa al diálogo las secciones cargadas para que su sub-presenter filtre
   *      en tiempo real qué aulas físicas están ocupadas en el turno seleccionado.
   * 3. Suscripción a `afterClosed`:
   *    - Si el diálogo cerró con éxito (`saved === true`), se le solicita al
   *      Presenter maestro refrescar el catálogo invocando `loadGradeSections()`.
   */
  private openSaveDialog(item?: GradeSectionItem): void {
    const data: GradesSectionsSaveDialogData = {
      mode: item ? 'edit' : 'create',
      gradeSection: item
        ? {
            id: item.id,
            gradeId: item.gradeId,
            sectionId: item.sectionId,
            classroomId: item.classroomId,
            shift: item.shift,
            maxCapacity: item.maxCapacity,
            enabled: item.status === 'Activa',
          }
        : undefined,
      existingSections: this.presenter.gradeSections(),
    };

    const dialogRef = this.dialog.open(GradesSectionsSaveDialogComponent, {
      width: '560px',
      data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.presenter.loadGradeSections();
      }
    });
  }
}
