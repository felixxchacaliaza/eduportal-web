import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Grade } from '../../../../../core/api';
import { GradesSectionsFilterState } from '../../models/interfaces/grades-sections-filter-state.interface';

/**
 * ============================================================================
 * GradesSectionsFiltersComponent (Dumb Component / Barra de Filtros)
 * ============================================================================
 * Componente presentacional encargado exclusivamente de capturar los criterios
 * de búsqueda y filtrado del usuario para delegarlos al componente padre.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. Flujo Unidireccional de Datos (Data Down, Events Up):
 *    - Recibe el estado actual mediante `filterState()` (Top-Down).
 *    - Notifica mutaciones al Smart Component mediante `filterChange.emit()` (Bottom-Up).
 * 2. Inmutabilidad Estricta:
 *    - Nunca modifica directamente `filterState()`. En su lugar, clona el estado
 *      previo usando el operador Spread (`...this.filterState()`) y sobreescribe
 *      únicamente la propiedad que cambió.
 * 3. ChangeDetectionStrategy.OnPush:
 *    - Al no tener estado interno mutable, solo re-renderiza cuando sus Inputs cambian.
 * ============================================================================
 */
@Component({
  selector: 'app-grades-sections-filters',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './grades-sections-filters.component.html',
  styleUrl: './grades-sections-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradesSectionsFiltersComponent {
  /** Catálogo de grados escolares disponibles para poblar el `<mat-select>` */
  public readonly grades = input.required<readonly Grade[]>();

  /** Estado actual de filtros recibido desde el Presenter a través del contenedor padre */
  public readonly filterState = input.required<GradesSectionsFilterState>();

  /** Emisor de eventos que notifica un cambio en los filtros hacia el padre */
  public readonly filterChange = output<GradesSectionsFilterState>();

  /** Emisor de evento para aperturar una nueva sección (disparado por el botón '+') */
  public readonly create = output<void>();

  /**
   * Maneja el cambio de grado seleccionado en el `<mat-select>`.
   * @param gradeId - Identificador del grado o 'ALL' para mostrar todos.
   */
  public onGradeChange(gradeId: string): void {
    this.filterChange.emit({
      ...this.filterState(),
      gradeId,
    });
  }

  /**
   * Maneja el cambio del filtro de estado operativo.
   * @param status - 'ALL', 'ACTIVE' o 'INACTIVE'.
   */
  public onStatusChange(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.filterChange.emit({
      ...this.filterState(),
      status,
    });
  }

  /**
   * Maneja la búsqueda en tiempo real tipeada en el input de texto.
   * @param search - Texto de búsqueda ingresado por el usuario.
   */
  public onSearchChange(search: string): void {
    this.filterChange.emit({
      ...this.filterState(),
      search,
    });
  }
}
