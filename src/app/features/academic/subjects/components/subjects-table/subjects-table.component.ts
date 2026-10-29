import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { SubjectItem } from '../../subjects.presenter';

@Component({
  selector: 'app-subjects-table',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './subjects-table.component.html',
  styleUrl: './subjects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsTableComponent {
  /** Catálogo de asignaturas a renderizar en la tabla */
  public readonly subjects = input.required<readonly SubjectItem[]>();

  /** Emite el ID de la asignatura cuyo estado operativo debe alternarse */
  public readonly toggleStatus = output<string>();

  /** Emite el ID de la asignatura a modificar */
  public readonly edit = output<string>();

  /** Columnas activas y orden de renderizado en el mat-table */
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