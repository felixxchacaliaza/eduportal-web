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
import { GradesSectionsSaveDialogData } from './dialogs/grades-sections-save-dialog/models/interface/grades-sections-save-dialog.interface';


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
  private readonly presenter = inject(GradesSectionsPresenter);
  private readonly dialog = inject(MatDialog);

  public readonly cards = this.presenter.cards;
  public readonly grades = this.presenter.grades;
  public readonly filterState = this.presenter.filterState;
  public readonly filteredSections = this.presenter.filteredSections;
  public readonly isLoading = this.presenter.isLoading;

  public onFilterChange(filters: GradesSectionsFilterState): void {
    this.presenter.applyFilters(filters);
  }

  public onCreateSection(): void {
    this.openSaveDialog();
  }

  public onEditSection(item: GradeSectionItem): void {
    this.openSaveDialog(item);
  }

  public onToggleStatus(id: string): void {
    this.presenter.toggleSectionStatus(id);
  }

  private openSaveDialog(item?: GradeSectionItem): void {
    const data: GradesSectionsSaveDialogData = {
      mode: item ? 'edit' : 'create',
      gradeSection: item ? { ...item, enabled: item.status === 'Activa' } : undefined,
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