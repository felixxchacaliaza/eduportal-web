import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Area, AreaService } from '../../../../../core/api';

export interface AreaSaveDialogData {
  readonly mode: 'create' | 'edit';
  readonly area?: Area;
}

/**
 * ============================================================================
 * AreaSaveDialogComponent (Modal de Creación y Edición)
 * ============================================================================
 * Diálogo modal para registrar o modificar un área curricular.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. Formulario Reactivo con Validación Estricta:
 *    - El nombre requiere un mínimo de 3 caracteres y un máximo de 100.
 * 2. Normalización de Datos:
 *    - El nombre se envía en mayúsculas para guardar coherencia en base de datos.
 *    - El backend autogenera el código correlativo (ej. MAT-001) si no se especifica.
 * 3. Feedback Visual de Errores:
 *    - Captura los errores de validación y unicidad del backend y los muestra en `errorMessage`.
 * ============================================================================
 */
@Component({
  selector: 'app-area-save-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './area-save-dialog.component.html',
  styleUrl: './area-save-dialog.component.scss',
})
export class AreaSaveDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AreaSaveDialogComponent>);
  public readonly data = inject<AreaSaveDialogData>(MAT_DIALOG_DATA);
  private readonly areaService = inject(AreaService);
  private readonly fb = inject(FormBuilder);

  public isSaving = false;
  public errorMessage: string | null = null;

  public readonly form: FormGroup = this.fb.group({
    name: [this.data.area?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: [this.data.area?.description || '', [Validators.maxLength(100)]],
  });

  public ngOnInit(): void {}

  public async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    try {
      const rawValue = this.form.getRawValue();
      const payload: Partial<Area> = {
        name: rawValue.name.trim().toUpperCase(),
        description: rawValue.description?.trim() || '',
      };

      if (this.data.mode === 'create') {
        await this.areaService.createArea({
          ...payload,
          enabled: true,
        });
      } else if (this.data.area?.id) {
        await this.areaService.updateArea(this.data.area.id, payload);
      }

      this.dialogRef.close(true);
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.message || 'Error al guardar el área curricular.';
    } finally {
      this.isSaving = false;
    }
  }

  public close(): void {
    this.dialogRef.close(false);
  }
}
