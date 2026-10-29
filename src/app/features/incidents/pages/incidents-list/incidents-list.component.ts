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
import { IncidentService } from '../../../attendances/attendance-management/services/incident.service';
import { IIncident } from '../../../attendances/attendance-management/models/incident.interface';
import { InfoCardComponent, InfoCardData } from '../../../../shared/components/info-card/info-card.component';

/**
 * ============================================================================
 * IncidentsListComponent (Bitácora de Convivencia y Psicología)
 * ============================================================================
 * Vista institucional para el monitoreo de conducta, méritos e incidencias.
 *
 * Arquitectura:
 * - Angular 22 Zoneless con Signals reactivos
 * - 1 Clase por archivo
 * - Full-width layout
 * ============================================================================
 */
@Component({
  selector: 'app-incidents-list',
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
  templateUrl: './incidents-list.component.html',
  styleUrl: './incidents-list.component.scss',
})
export class IncidentsListComponent implements OnInit {
  private readonly incidentService = inject(IncidentService);

  public readonly displayedColumns: string[] = [
    'code',
    'student',
    'type',
    'severity',
    'titleDescription',
    'reportedBy',
    'incidentDate',
    'status',
  ];

  public readonly isLoading = signal<boolean>(true);
  public readonly incidents = signal<IIncident[]>([]);
  public readonly searchTerm = signal<string>('');
  public readonly selectedSeverity = signal<string>('ALL');
  public readonly selectedType = signal<string>('ALL');

  /** Tarjetas métricas KPI de convivencia */
  public readonly cards = computed<InfoCardData[]>(() => {
    const list = this.incidents();
    const total = list.length;
    const meritos = list.filter(i => i.type === 'MERITO').length;
    const graves = list.filter(i => i.severity === 'GRAVE' || i.type === 'GRAVE').length;
    const abiertas = list.filter(i => i.status === 'ABIERTA' || i.status === 'EN_SEGUIMIENTO').length;

    return [
      {
        icon: 'psychology',
        label: 'Total Incidencias',
        value: `${total}`,
        indicator: 'En Bitácora Escolar',
        iconBgClass: 'bg-primary-light',
        iconColorClass: 'text-primary'
      },
      {
        icon: 'star',
        label: 'Méritos y Reconocimientos',
        value: `${meritos}`,
        indicator: 'Conducta Ejemplar',
        iconBgClass: 'bg-success-light',
        iconColorClass: 'text-success'
      },
      {
        icon: 'warning',
        label: 'Severidad Grave',
        value: `${graves}`,
        indicator: 'Casos Críticos',
        iconBgClass: 'bg-danger-light',
        iconColorClass: 'text-danger'
      },
      {
        icon: 'pending_actions',
        label: 'En Seguimiento / Abiertas',
        value: `${abiertas}`,
        indicator: 'Atención Psicológica',
        iconBgClass: 'bg-warning-light',
        iconColorClass: 'text-warning'
      }
    ];
  });

  /** Lista filtrada reactivamente */
  public readonly filteredIncidents = computed<IIncident[]>(() => {
    const list = this.incidents();
    const sev = this.selectedSeverity();
    const type = this.selectedType();
    const term = this.searchTerm().trim().toLowerCase();

    return list.filter(inc => {
      const matchSev = sev === 'ALL' || inc.severity === sev;
      const matchType = type === 'ALL' || inc.type === type;

      let matchSearch = true;
      if (term) {
        const studentName = inc.student?.person
          ? `${inc.student.person.firstName || ''} ${inc.student.person.lastName || ''}`.toLowerCase()
          : '';
        const title = (inc.title || '').toLowerCase();
        const desc = (inc.description || '').toLowerCase();
        const code = (inc.code || '').toLowerCase();

        matchSearch = studentName.includes(term) || title.includes(term) || desc.includes(term) || code.includes(term);
      }

      return matchSev && matchType && matchSearch;
    });
  });

  public async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  public async loadData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const data = await this.incidentService.getAll();
      this.incidents.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  public onSeverityChange(sev: string): void {
    this.selectedSeverity.set(sev);
  }

  public onTypeChange(type: string): void {
    this.selectedType.set(type);
  }
}
