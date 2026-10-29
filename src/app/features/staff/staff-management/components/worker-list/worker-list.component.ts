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
import { IWorker } from '../../models';
import { StaffPaginatorIntl } from '../staff-paginator-intl';

/**
 * ============================================================================
 * WorkerListComponent
 * ============================================================================
 * Componente presentacional puro (Dumb Component) para la tabla de trabajadores.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-worker-list',
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
  templateUrl: './worker-list.component.html',
  styleUrl: './worker-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkerListComponent {
  public readonly workers = input.required<readonly IWorker[]>();
  public readonly isLoading = input<boolean>(false);

  public readonly edit = output<IWorker>();
  public readonly toggleStatus = output<IWorker>();

  public readonly pageSize = signal<number>(5);
  public readonly pageIndex = signal<number>(0);

  public readonly pagedWorkers = computed<readonly IWorker[]>(() => {
    const list = this.workers();
    const start = this.pageIndex() * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  public readonly displayedColumns: readonly string[] = [
    'code',
    'dni',
    'fullName',
    'position',
    'shift',
    'hireDate',
    'status',
    'actions'
  ];

  constructor() {
    effect(() => {
      this.workers();
      this.pageIndex.set(0);
    });
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  public getPositionName(worker: IWorker): string {
    if (typeof worker.position === 'object' && worker.position?.name) {
      return worker.position.name;
    }
    return 'Personal de Apoyo';
  }

  public getShiftLabel(shift?: string): string {
    switch (shift) {
      case 'MAÑANA':
        return 'Mañana';
      case 'TARDE':
        return 'Tarde';
      case 'COMPLETO':
        return 'Completo';
      default:
        return shift || 'Completo';
    }
  }
}
