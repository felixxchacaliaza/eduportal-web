import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GradeSubjectsPresenter } from './grade-subjects.presenter';
import { GradeSubjectsTabsComponent } from './components/grade-subjects-tabs/grade-subjects-tabs.component';
import { GradeSubjectsFiltersComponent } from './components/grade-subjects-filters/grade-subjects-filters.component';
import { GradeSubjectsTableComponent } from './components/grade-subjects-table/grade-subjects-table.component';

@Component({
  selector: 'app-grade-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    GradeSubjectsTabsComponent,
    GradeSubjectsFiltersComponent,
    GradeSubjectsTableComponent,
  ],
  providers: [GradeSubjectsPresenter],
  templateUrl: './grade-subjects.component.html',
  styleUrl: './grade-subjects.component.scss',
})
export class GradeSubjectsComponent {
  public readonly presenter = inject(GradeSubjectsPresenter);
}

