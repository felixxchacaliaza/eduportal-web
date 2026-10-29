import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { PositionService } from '../../../staff/staff-management/services/position.service';
import { IPosition } from '../../../staff/staff-management/models/position.interface';
import { InfoCardComponent, InfoCardData } from '../../../../shared/components/info-card/info-card.component';

/**
 * ============================================================================
 * PositionsComponent (Mantenimiento de Cargos Institucionales)
 * ============================================================================
 * Vista administrativa para el catálogo de cargos y puestos de trabajo escolar.
 *
 * Arquitectura:
 * - Angular 22 Zoneless con Signals reactivos y computed
 * - Regla estricta: 1 Clase por archivo
 * - Full-width layout
 * ============================================================================
 */
@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    InfoCardComponent,
  ],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.scss',
})
export class PositionsComponent implements OnInit {
  private readonly positionService = inject(PositionService);

  public readonly displayedColumns: string[] = ['code', 'name', 'department', 'description', 'status'];

  public readonly isLoading = signal<boolean>(true);
  public readonly positions = signal<IPosition[]>([]);
  public readonly searchTerm = signal<string>('');
  public readonly selectedDepartment = signal<string>('ALL');

  /** Tarjetas KPI reactivas */
  public readonly cards = computed<InfoCardData[]>(() => {
    const list = this.positions();
    const total = list.length;
    const active = list.filter(p => p.enabled !== false).length;
    const depts = new Set(list.map(p => p.department)).size;

    return [
      {
        icon: 'work',
        label: 'Total Cargos',
        value: `${total}`,
        indicator: 'En Catálogo',
        iconBgClass: 'bg-primary-light',
        iconColorClass: 'text-primary'
      },
      {
        icon: 'check_circle',
        label: 'Cargos Activos',
        value: `${active}`,
        indicator: `${Math.round((active / (total || 1)) * 100)}% Habilitados`,
        iconBgClass: 'bg-success-light',
        iconColorClass: 'text-success'
      },
      {
        icon: 'corporate_fare',
        label: 'Departamentos',
        value: `${depts}`,
        indicator: 'Áreas Operativas',
        iconBgClass: 'bg-info-light',
        iconColorClass: 'text-info'
      },
      {
        icon: 'badge',
        label: 'Estructura ROF',
        value: 'MINEDU',
        indicator: 'Normativa Escolar',
        iconBgClass: 'bg-warning-light',
        iconColorClass: 'text-warning'
      }
    ];
  });

  /** Catálogo de cargos filtrado reactivamente */
  public readonly filteredPositions = computed<IPosition[]>(() => {
    const list = this.positions();
    const dept = this.selectedDepartment();
    const term = this.searchTerm().trim().toLowerCase();

    return list.filter(p => {
      const matchDept = dept === 'ALL' || p.department === dept;
      let matchSearch = true;
      if (term) {
        matchSearch =
          (p.name || '').toLowerCase().includes(term) ||
          (p.code || '').toLowerCase().includes(term) ||
          (p.description || '').toLowerCase().includes(term);
      }
      return matchDept && matchSearch;
    });
  });

  public async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  public async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.positionService.getPositions();
      this.positions.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  public onDepartmentChange(dept: string): void {
    this.selectedDepartment.set(dept);
  }
}
