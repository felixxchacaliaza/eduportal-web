import { Component, input, output } from '@angular/core';
import { GradeStat } from '../../models/interfaces/grade-stat.interface';

@Component({
  selector: 'app-grade-subjects-tabs',
  standalone: true,
  templateUrl: './grade-subjects-tabs.component.html',
  styleUrl: './grade-subjects-tabs.component.scss',
})
export class GradeSubjectsTabsComponent {
  public readonly stats = input.required<readonly GradeStat[]>();
  public readonly selectedGradeId = input.required<string>();
  public readonly gradeSelected = output<string>();

  public onSelect(gradeId: string): void {
    this.gradeSelected.emit(gradeId);
  }
}