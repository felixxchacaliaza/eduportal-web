import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ITeacher } from '../../models';
import { StaffPaginatorIntl } from '../staff-paginator-intl';

/**
 * ============================================================================
 * TeacherListComponent
 * ============================================================================
 * Componente presentacional puro (Dumb Component) para la tabla de profesores.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: StaffPaginatorIntl }
  ],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherListComponent {
  public readonly teachers = input.required<readonly ITeacher[]>();
  public readonly isLoading = input<boolean>(false);

  public readonly edit = output<ITeacher>();
  public readonly toggleStatus = output<ITeacher>();

  public readonly pageSize = signal<number>(5);
  public readonly pageIndex = signal<number>(0);

  public readonly pagedTeachers = computed<readonly ITeacher[]>(() => {
    const list = this.teachers();
    const start = this.pageIndex() * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  public readonly displayedColumns: readonly string[] = [
    'code',
    'dni',
    'fullName',
    'specialty',
    'academicDegree',
    'contractedHours',
    'status',
    'actions'
  ];

  constructor() {
    effect(() => {
      this.teachers();
      this.pageIndex.set(0);
    });
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  public getDegreeLabel(degree?: string): string {
    switch (degree) {
      case 'LICENCIADO':
        return 'Licenciado';
      case 'MAGISTER':
        return 'Magíster';
      case 'DOCTOR':
        return 'Doctor';
      case 'PROFESOR_TITULADO':
        return 'Prof. Titulado';
      default:
        return degree || 'Licenciado';
    }
  }
}
