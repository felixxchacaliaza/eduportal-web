import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IStudent, IGuardianSubdoc, IEnrollment } from '../../models';
import { StudentPaginatorIntl } from './student-paginator-intl';

/**
 * ============================================================================
 * StudentListComponent
 * ============================================================================
 * Componente presentacional puro (Dumb Component) para el listado del padrón.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatPaginatorModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: StudentPaginatorIntl },
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListComponent {
  public readonly students = input.required<readonly IStudent[]>();
  public readonly isLoading = input<boolean>(false);

  public readonly edit = output<IStudent>();
  public readonly enroll = output<IStudent>();
  public readonly changeSection = output<IStudent>();
  public readonly delete = output<IStudent>();

  public readonly pageSize = signal<number>(5);
  public readonly pageIndex = signal<number>(0);

  public readonly pagedStudents = computed<readonly IStudent[]>(() => {
    const list = this.students();
    const start = this.pageIndex() * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  public readonly displayedColumns: readonly string[] = [
    'dni',
    'fullName',
    'code',
    'guardians',
    'enrollment',
    'status',
    'actions',
  ];

  constructor() {
    effect(() => {
      const total = this.students().length;
      const maxIndex = Math.max(0, Math.ceil(total / this.pageSize()) - 1);
      if (this.pageIndex() > maxIndex) {
        this.pageIndex.set(0);
      }
    });
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  public getPrimaryGuardian(guardians?: IGuardianSubdoc[]): string {
    if (!guardians || guardians.length === 0) return 'Sin apoderado';
    const primary = guardians.find(g => g.isPrimary);
    const target = primary || guardians[0];
    const name = target.person ? `${target.person.lastName}, ${target.person.firstName}` : 'Apoderado';
    return `${name} (${target.relationship})`;
  }

  public isEnrolled(student: IStudent): boolean {
    return !!student.currentEnrollment && student.currentEnrollment.status === 'MATRICULADO';
  }

  public getEnrollmentSummary(enrollment?: IEnrollment | null): string {
    if (!enrollment) return 'Sin Matrícula';
    const gs = enrollment.gradeSection as any;
    if (typeof gs === 'object' && gs !== null) {
      const gradeDesc = gs.grade?.description || gs.grade?.name || 'Grado';
      const secName = gs.section?.name || '';
      const shift = gs.shift ? ` (${gs.shift})` : '';
      return `${gradeDesc} "${secName}"${shift}`;
    }
    return enrollment.code || 'Matriculado';
  }
}
