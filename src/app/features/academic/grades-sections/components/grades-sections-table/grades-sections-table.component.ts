import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GradeSectionItem } from '../../models/interfaces/grade-section-item.interface';

/**
 * ============================================================================
 * GradesSectionsTableComponent (Dumb Component / Tabla de Secciones)
 * ============================================================================
 * Renderiza la grilla de datos de secciones escolares vinculadas a sus aulas
 * físicas, turnos y capacidades mediante Angular Material `mat-table`.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. Componente de Presentación Pura:
 *    - No realiza llamadas a endpoints ni gestiona modales de edición.
 *    - Emite intenciones de usuario hacia el Smart Component mediante `output()`.
 * 2. Layout Fijo e Inmutable:
 *    - Las columnas utilizan `table-layout: fixed` en SCSS con anchos calculados
 *      proporcionalmente, impidiendo movimientos indeseados del layout al tipear.
 * 3. ChangeDetectionStrategy.OnPush:
 *    - La tabla solo se refresca cuando la Signal `sections()` emite una nueva
 *      referencia inmutable de la lista filtrada.
 * ============================================================================
 */
@Component({
  selector: 'app-grades-sections-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './grades-sections-table.component.html',
  styleUrl: './grades-sections-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradesSectionsTableComponent {
  /** Lista inmutable de secciones a renderizar en la tabla */
  public readonly sections = input.required<readonly GradeSectionItem[]>();

  /** Emite el ID de la sección para alternar su estado activo/inactivo */
  public readonly toggleStatus = output<string>();

  /** Emite el item completo de la sección que el usuario desea editar */
  public readonly edit = output<GradeSectionItem>();

  /** Orden y definición de columnas visibles en la tabla */
  public readonly displayedColumns: readonly string[] = [
    'grade',
    'section',
    'classroom',
    'shift',
    'capacity',
    'status',
    'actions',
  ];
}
