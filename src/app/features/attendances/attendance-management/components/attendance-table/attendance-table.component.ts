import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttendanceStatus } from '../../models/attendance-status.type';

/**
 * ============================================================================
 * AttendanceTableComponent
 * ============================================================================
 * Componente dumb de tabla reactiva para la matriz de asistencia diaria.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-attendance-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './attendance-table.component.html',
  styleUrl: './attendance-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceTableComponent {
  @Input() public items!: FormArray<FormGroup>;
  @Input() public isLoading = false;

  @Output() public readonly statusChange = new EventEmitter<{ index: number; status: AttendanceStatus }>();
  @Output() public readonly observationChange = new EventEmitter<{ index: number; observation: string }>();
  @Output() public readonly reportIncident = new EventEmitter<{
    studentId: string;
    studentName: string;
    studentDni: string;
  }>();

  public onSetStatus(index: number, status: AttendanceStatus): void {
    const group = this.items.at(index);
    if (group) {
      group.patchValue({ status });
      this.statusChange.emit({ index, status });
    }
  }

  public onObservationChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const observation = input?.value || '';
    const group = this.items.at(index);
    if (group) {
      group.patchValue({ observation });
      this.observationChange.emit({ index, observation });
    }
  }

  public onReportIncident(group: FormGroup): void {
    const studentId = group.get('student')?.value;
    const studentName = group.get('studentName')?.value;
    const studentDni = group.get('studentDni')?.value;

    this.reportIncident.emit({
      studentId,
      studentName,
      studentDni
    });
  }
}
