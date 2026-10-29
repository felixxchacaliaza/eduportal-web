import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AcademicYear } from '../../../../../core/api';
import { GradeSubjectsFilterState } from '../../models/interfaces/grade-subjects-filter-state.interface';

@Component({
  selector: 'app-grade-subjects-filters',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './grade-subjects-filters.component.html',
  styleUrl: './grade-subjects-filters.component.scss',
})
export class GradeSubjectsFiltersComponent {
  public readonly academicYears = input.required<readonly AcademicYear[]>();
  public readonly selectedYear = input.required<string>();
  public readonly areas = input.required<readonly { label: string; value: string }[]>();
  public readonly filterState = input.required<GradeSubjectsFilterState>();

  public readonly yearChange = output<string>();
  public readonly filterChange = output<Partial<GradeSubjectsFilterState>>();

  public readonly statusOptions = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Solo Asignadas', value: 'ASSIGNED' },
    { label: 'Solo No Asignadas', value: 'UNASSIGNED' },
  ] as const;

  public onYearSelect(year: string): void {
    this.yearChange.emit(year);
  }

  public onAreaSelect(area: string): void {
    this.filterChange.emit({ area });
  }

  public onStatusSelect(assignmentStatus: 'ALL' | 'ASSIGNED' | 'UNASSIGNED'): void {
    this.filterChange.emit({ assignmentStatus });
  }

  public onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterChange.emit({ search: inputElement.value });
  }
}