import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilterOption } from '../../../components/subjects-filters/models/interfaces/filter-option.interface';
import { SubjectItem } from '../../../subjects.presenter';
import { SubjectsSaveFormPayload } from '../models/interfaces/subjects-save-form-payload.interface';
import { SubjectsSaveDialogFormPresenter } from './subjects-save-dialog-form.presenter';

/**
 * ============================================================================
 * SubjectsSaveDialogFormComponent
 * ============================================================================
 * Componente presentacional desacoplado para el formulario de asignaturas.
 *
 * @remarks
 * Implementa el patrón **Presentational Component (Dumb Component)**:
 * - **Independencia:** No conoce diálogos ni llamadas HTTP; es reutilizable en modales,
 *   paneles laterales (drawers) o páginas completas.
 * - **Delegación:** Transfiere la gestión del estado y validaciones a {@link SubjectsSaveDialogFormPresenter}.
 * - **Reactividad:** Utiliza Signals para sus `inputs()` y `outputs()`, y estrategia `OnPush`.
 * ============================================================================
 */
@Component({
  selector: 'app-subjects-save-dialog-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [SubjectsSaveDialogFormPresenter],
  templateUrl: './subjects-save-dialog-form.component.html',
  styleUrl: './subjects-save-dialog-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsSaveDialogFormComponent {
  /** Inyección del presentador dedicado a la lógica y estado del formulario */
  public readonly presenter = inject(SubjectsSaveDialogFormPresenter);

  /** Modo de apertura recibido: 'create' para registrar o 'edit' para modificar */
  public readonly mode = input<'create' | 'edit'>('create');

  /** Datos de la asignatura en caso de encontrarse en modo edición */
  public readonly initialData = input<SubjectItem | null | undefined>(null);

  /** Catálogo de áreas académicas suministrado por el contenedor */
  public readonly areas = input.required<readonly FilterOption[]>();

  /** Indicador de guardado en proceso para bloqueo de controles y animación de UI */
  public readonly isSaving = input<boolean>(false);

  /** Evento emitido al completar válidamente el formulario con el payload formateado */
  public readonly formSubmit = output<SubjectsSaveFormPayload>();

  /** Evento emitido cuando el usuario cancela la operación */
  public readonly formCancel = output<void>();

  /** Áreas seleccionables para el `<mat-select>` (excluyendo el comodín 'ALL') */
  public readonly selectableAreas = computed(() =>
    this.areas().filter(option => option.value !== 'ALL')
  );

  constructor() {
    // Sincronización reactiva ante cambios en los datos iniciales
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.presenter.preloadData(data);
      } else {
        this.presenter.resetForm();
      }
    });
  }

  /**
   * Valida el formulario mediante el presenter y emite el payload limpio si es válido.
   */
  public onSubmit(): void {
    if (this.presenter.form.invalid) {
      this.presenter.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.presenter.getPayload());
  }

  /**
   * Notifica la cancelación de la operación al componente contenedor.
   */
  public onCancel(): void {
    this.formCancel.emit();
  }
}
