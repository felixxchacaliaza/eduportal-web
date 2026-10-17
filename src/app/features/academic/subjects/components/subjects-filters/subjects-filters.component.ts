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

/**
 * Componente presentacional puro (Dumb Component) para la barra de filtros y búsqueda.
 *
 * @remarks
 * No posee dependencias de servicios HTTP ni inyecciones de presenters.
 * Comunica su estado mediante la nueva API reactiva de Angular:
 * - `input()`: Recibe la lista de áreas académicas dinámicas.
 * - `output()`: Emite cambios consolidados en los filtros y la acción de creación.
 */
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
  /**
   * Opciones dinámicas de áreas curriculares recibidas desde el componente padre.
   */
  public readonly areas = input.required<readonly FilterOption[]>();

  /**
   * Evento emitido al modificarse cualquier criterio de filtro (Área, Estado o Búsqueda).
   */
  public readonly filterChange = output<SubjectsFilterState>();

  /**
   * Evento emitido al presionar el botón "Nueva Asignatura".
   */
  public readonly create = output<void>();

  /** Opciones estáticas para el filtro de estado operativo */
  public readonly statusOptions: readonly FilterOption[] = [
    { label: 'Todos los Estados', value: 'ALL' },
    { label: 'Activa', value: 'Activa' },
    { label: 'Desactiva', value: 'Desactiva' },
  ];

  /** Valor seleccionado para el filtro de Área ('ALL' por defecto) */
  public readonly selectedArea = signal<string>('ALL');

  /** Valor seleccionado para el filtro de Estado ('ALL' por defecto) */
  public readonly selectedStatus = signal<string>('ALL');

  /** Texto de búsqueda ingresado por el usuario */
  public readonly search = signal<string>('');

  /**
   * Manejador de cambio en el selector de área curricular.
   */
  public onAreaChange(area: string): void {
    this.selectedArea.set(area);
    this.emitFilters();
  }

  /**
   * Manejador de cambio en el selector de estado operativo.
   */
  public onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    this.emitFilters();
  }

  /**
   * Manejador de entrada de texto en el buscador.
   */
  public onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.search.set(target.value);
    this.emitFilters();
  }

  /**
   * Detona la emisión del evento de creación hacia el padre.
   */
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
