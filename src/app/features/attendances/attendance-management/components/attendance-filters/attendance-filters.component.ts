import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * ============================================================================
 * AttendanceFiltersComponent
 * ============================================================================
 * Componente dumb de filtros y acciones rápidas para la matriz de asistencia.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-attendance-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './attendance-filters.component.html',
  styleUrl: './attendance-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceFiltersComponent {
  @Input() public gradeSections: readonly any[] = [];
  @Input() public selectedGradeSection = '';
  @Input() public selectedDate = '';
  @Input() public isLoading = false;
  @Input() public isSaving = false;
  @Input() public totalStudents = 0;

  @Output() public readonly gradeSectionChange = new EventEmitter<string>();
  @Output() public readonly dateChange = new EventEmitter<string>();
  @Output() public readonly markAllPresent = new EventEmitter<void>();
  @Output() public readonly saveAttendances = new EventEmitter<void>();

  public onDateInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      this.dateChange.emit(input.value);
    }
  }
}
