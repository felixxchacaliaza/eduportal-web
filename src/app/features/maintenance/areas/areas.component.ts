import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { AreasPresenter, AreasFilterState } from './areas.presenter';
import { Area } from '../../../core/api';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { AreaSaveDialogComponent, AreaSaveDialogData } from './dialogs/area-save-dialog/area-save-dialog.component';

/**
 * ============================================================================
 * AreasComponent (Smart Component / Container)
 * ============================================================================
 * Vista principal de mantenimiento para el catálogo de Áreas Curriculares.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. Director de Escena (UI Orchestrator):
 *    - Inyecta `MatDialog` y gestiona la apertura modal (`AreaSaveDialogComponent`).
 *    - Recibe eventos del DOM y los delega a los métodos del `AreasPresenter`.
 * 2. Scoped Presenter Provider:
 *    - `providers: [AreasPresenter]`: Ciclo de vida local que asegura la destrucción
 *      del presenter al navegar fuera de la ruta, liberando memoria.
 * 3. Data Top-Down:
 *    - Enlaza reactivamente las Signals del Presenter a la plantilla HTML.
 * ============================================================================
 */
@Component({
  selector: 'app-areas',
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    InfoCardComponent,
  ],
  providers: [AreasPresenter],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss',
})
export class AreasComponent {
  private readonly presenter = inject(AreasPresenter);
  private readonly dialog = inject(MatDialog);

  public readonly cards = this.presenter.cards;
  public readonly filterState = this.presenter.filterState;
  public readonly filteredAreas = this.presenter.filteredAreas;
  public readonly isLoading = this.presenter.isLoading;

  public readonly displayedColumns: readonly string[] = [
    'code',
    'name',
    'description',
    'status',
    'actions',
  ];

  public onSearchChange(search: string): void {
    this.presenter.applyFilters({
      ...this.filterState(),
      search,
    });
  }

  public onStatusFilterChange(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.presenter.applyFilters({
      ...this.filterState(),
      status,
    });
  }

  public onToggleStatus(id: string): void {
    this.presenter.toggleAreaStatus(id);
  }

  public onCreateArea(): void {
    this.openSaveDialog();
  }

  public onEditArea(area: Area): void {
    this.openSaveDialog(area);
  }

  private openSaveDialog(area?: Area): void {
    const data: AreaSaveDialogData = {
      mode: area ? 'edit' : 'create',
      area,
    };

    const dialogRef = this.dialog.open(AreaSaveDialogComponent, {
      width: '520px',
      data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.presenter.loadAreas();
      }
    });
  }
}
