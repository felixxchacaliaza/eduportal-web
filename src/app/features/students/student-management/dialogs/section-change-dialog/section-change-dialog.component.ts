import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SectionChangeDialogFormComponent } from './form/section-change-dialog-form.component';
import { SectionChangeDialogPresenter } from './section-change-dialog.presenter';

/**
 * ============================================================================
 * SectionChangeDialogComponent
 * ============================================================================
 * Contenedor del Diálogo Modal (Dialog Shell) para cambio de sección escolar.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-section-change-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    SectionChangeDialogFormComponent,
  ],
  providers: [SectionChangeDialogPresenter],
  templateUrl: './section-change-dialog.component.html',
  styleUrl: './section-change-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionChangeDialogComponent implements OnInit {
  public readonly presenter = inject(SectionChangeDialogPresenter);

  public ngOnInit(): void {
    this.presenter.loadSections();
  }

  public onFormSubmit(newSectionId: string): void {
    this.presenter.changeSection(newSectionId);
  }

  public onFormCancel(): void {
    this.presenter.close();
  }
}
