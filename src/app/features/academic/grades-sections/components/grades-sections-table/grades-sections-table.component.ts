import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GradeSectionItem } from '../../models/interfaces/grade-section-item.interface';

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
  public readonly sections = input.required<readonly GradeSectionItem[]>();
  public readonly toggleStatus = output<string>();
  public readonly edit = output<GradeSectionItem>();

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