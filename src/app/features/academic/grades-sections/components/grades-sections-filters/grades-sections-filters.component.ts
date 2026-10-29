import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Grade } from '../../../../../core/api';
import { GradesSectionsFilterState } from '../../models/interfaces/grades-sections-filter-state.interface';

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
  public readonly grades = input.required<readonly Grade[]>();
  public readonly filterState = input.required<GradesSectionsFilterState>();

  public readonly filterChange = output<GradesSectionsFilterState>();
  public readonly create = output<void>();

  public onGradeChange(gradeId: string): void {
    this.filterChange.emit({ ...this.filterState(), gradeId });
  }

  public onStatusChange(status: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
    this.filterChange.emit({ ...this.filterState(), status });
  }

  public onSearchChange(search: string): void {
    this.filterChange.emit({ ...this.filterState(), search });
  }
}