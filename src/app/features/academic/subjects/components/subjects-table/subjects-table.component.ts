import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SubjectItem } from '../../subjects.presenter';

/**
 * Componente presentacional puro (Dumb Component) para la tabla de asignaturas.
 *
 * @remarks
 * Renderiza el listado tabular empleando componentes de Angular Material estilizados
 * con metodología BEM (`.subjects-table`) y sin directivas `!important`.
 *
 * Se comunica exclusivamente vía `input()` y `output()`:
 * - `input()`: Recibe el listado inmutable de asignaturas filtradas (`subjects`).
 * - `output()`: Emite eventos para alternar estado (`toggleStatus`) y editar (`edit`).
 */
@Component({
  selector: 'app-subjects-table',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './subjects-table.component.html',
  styleUrl: './subjects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsTableComponent {
  /**
   * Catálogo de asignaturas a renderizar en la tabla, suministrado por el componente padre.
   */
  public readonly subjects = input.required<readonly SubjectItem[]>();

  /**
   * Emite el identificador de la asignatura cuyo estado operativo debe alternarse.
   */
  public readonly toggleStatus = output<string>();

  /**
   * Emite el identificador de la asignatura a modificar.
   */
  public readonly edit = output<string>();

  /**
   * Columnas activas y orden de renderizado en el mat-table.
   */
  public readonly displayedColumns: readonly string[] = [
    'code',
    'name',
    'description',
    'area',
    'hours',
    'status',
    'actions',
  ];
}
