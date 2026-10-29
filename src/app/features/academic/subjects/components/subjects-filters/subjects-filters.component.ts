import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FilterOption } from './models/interfaces/filter-option.interface';
import { SubjectsFilterState } from './models/interfaces/subjects-filter-state.interface';

@Component({
  selector: 'app-subjects-filters',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './subjects-filters.component.html',
  styleUrl: './subjects-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsFiltersComponent {
  /** Opciones dinámicas de áreas curriculares recibidas desde el componente padre */
  public readonly areas = input.required<readonly FilterOption[]>();

  /** Evento emitido al modificarse cualquier criterio de filtro (Área, Estado o Búsqueda) */
  public readonly filterChange = output<SubjectsFilterState>();

  /** Evento emitido al presionar el botón "Nueva Asignatura" */
  public readonly create = output<void>();

  /** Opciones estáticas para el filtro de estado operativo */
  public readonly statusOptions: readonly FilterOption[] = [
    { label: 'Todos los Estados', value: 'ALL' },
    { label: 'Activa', value: 'Activa' },
    { label: 'Desactiva', value: 'Desactiva' },
  ];

  public readonly selectedArea = signal<string>('ALL');
  public readonly selectedStatus = signal<string>('ALL');
  public readonly search = signal<string>('');

  public onAreaChange(area: string): void {
    this.selectedArea.set(area);
    this.emitFilters();
  }

  public onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    this.emitFilters();
  }

  public onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
    this.emitFilters();
  }

  public onCreate(): void {
    this.create.emit();
  }

  private emitFilters(): void {
    this.filterChange.emit({
      area: this.selectedArea(),
      status: this.selectedStatus(),
      search: this.search(),
    });
  }
}