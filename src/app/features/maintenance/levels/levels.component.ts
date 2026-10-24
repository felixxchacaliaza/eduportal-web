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
import { LevelsPresenter, LevelsFilterState } from './levels.presenter';
import { Level } from '../../../core/api';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { LevelSaveDialogComponent, LevelSaveDialogData } from './dialogs/level-save-dialog/level-save-dialog.component';

/**
 * ============================================================================
 * LevelsComponent (Smart Component / Container)
 * ============================================================================
 * Vista principal de mantenimiento para el catálogo de Niveles Educativos.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. Director de Escena (UI Orchestrator):
 *    - Inyecta `MatDialog` para abrir los formularios modales de creación/edición.
 *    - Captura eventos del DOM del usuario y delega la ejecución al `LevelsPresenter`.
 * 2. Ciclo de Vida Local del Presenter:
 *    - `providers: [LevelsPresenter]`: El presenter se destruye automáticamente
 *      cuando el usuario sale de esta vista, liberando memoria.
 * 3. Enlace Reactivo Declarativo:
 *    - Expone las Signals de solo lectura del Presenter (`cards`, `filteredLevels`,
 *      `isLoading`) hacia la plantilla HTML.
 * ============================================================================
 */
@Component({
  selector: 'app-levels',
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
  providers: [LevelsPresenter],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.scss',
})
export class LevelsComponent {
  private readonly presenter = inject(LevelsPresenter);
  private readonly dialog = inject(MatDialog);

  public readonly cards = this.presenter.cards;
  public readonly filterState = this.presenter.filterState;
  public readonly filteredLevels = this.presenter.filteredLevels;
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
    this.presenter.toggleLevelStatus(id);
  }

  public onCreateLevel(): void {
    this.openSaveDialog();
  }

  public onEditLevel(level: Level): void {
    this.openSaveDialog(level);
  }

  private openSaveDialog(level?: Level): void {
    const data: LevelSaveDialogData = {
      mode: level ? 'edit' : 'create',
      level,
    };

    const dialogRef = this.dialog.open(LevelSaveDialogComponent, {
      width: '520px',
      data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((saved: boolean) => {
      if (saved) {
        this.presenter.loadLevels();
      }
    });
  }
}
