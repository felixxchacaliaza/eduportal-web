import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GradeSubjectRow } from '../../models/interfaces/grade-subject-row.interface';

@Component({
  selector: 'app-grade-subjects-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './grade-subjects-table.component.html',
  styleUrl: './grade-subjects-table.component.scss',
})
export class GradeSubjectsTableComponent {
  public readonly rows = input.required<readonly GradeSubjectRow[]>();
  public readonly isOperating = input<boolean>(false);

  public readonly toggleAssignment = output<GradeSubjectRow>();

  public readonly displayedColumns: readonly string[] = [
    'assign',
    'code',
    'name',
    'area',
    'hours',
    'operationalStatus',
    'assignmentStatus',
    'actions',
  ];

  public onRowToggle(row: GradeSubjectRow): void {
    if (this.isOperating()) return;
    this.toggleAssignment.emit(row);
  }
}