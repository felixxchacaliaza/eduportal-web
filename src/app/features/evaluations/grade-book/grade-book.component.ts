import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeBookPresenter } from './grade-book.presenter';
import { GradeBookFormPresenter } from './form/grade-book-form.presenter';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { GradeBookFiltersComponent } from './components/grade-book-filters/grade-book-filters.component';
import { GradeBookMatrixComponent } from './components/grade-book-matrix/grade-book-matrix.component';

/**
 * ============================================================================
 * GradeBookComponent (Smart Container)
 * ============================================================================
 * Contenedor maestro de la Matriz Dinámica de Calificaciones MINEDU.
 *
 * @remarks
 * Provee:
 * - `GradeBookPresenter` como cerebro orquestador desacoplado.
 * - `GradeBookFormPresenter` como motor de la matriz reactiva 2D.
 * - Diseño de ancho completo (`width: 100%`) sin restricciones de centrado.
 * ============================================================================
 */
@Component({
  selector: 'app-grade-book',
  standalone: true,
  imports: [
    CommonModule,
    InfoCardComponent,
    GradeBookFiltersComponent,
    GradeBookMatrixComponent
  ],
  templateUrl: './grade-book.component.html',
  styleUrls: ['./grade-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    GradeBookFormPresenter,
    GradeBookPresenter
  ]
})
export class GradeBookComponent implements OnInit {
  public readonly presenter = inject(GradeBookPresenter);

  public ngOnInit(): void {
    this.presenter.init();
  }
}
