import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Level, LevelService } from '../../../../../core/api';

export interface LevelSaveDialogData {
  readonly mode: 'create' | 'edit';
  readonly level?: Level;
}

/**
 * ============================================================================
 * LevelSaveDialogComponent (Modal de Creación y Edición)
 * ============================================================================
 * Diálogo modal para registrar o modificar un nivel educativo.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. Formulario Reactivo Tipado:
 *    - Validación síncrona en cliente (`Validators.required`, `Validators.minLength`).
 * 2. Inmutabilidad y Normalización:
 *    - El nombre se normaliza en mayúsculas (`cleanName = name.trim().toUpperCase()`)
 *      antes de enviarlo a la API para mantener consistencia con los estándares MINEDU.
 * 3. Tolerancia a Fallos:
 *    - Captura mensajes de error del backend (ej: duplicado de nombre) y los expone
 *      en el banner visual `errorMessage`.
 * ============================================================================
 */
@Component({
  selector: 'app-level-save-dialog',
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
  templateUrl: './level-save-dialog.component.html',
  styleUrl: './level-save-dialog.component.scss',
})
export class LevelSaveDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<LevelSaveDialogComponent>);
  public readonly data = inject<LevelSaveDialogData>(MAT_DIALOG_DATA);
  private readonly levelService = inject(LevelService);
  private readonly fb = inject(FormBuilder);

  public isSaving = false;
  public errorMessage: string | null = null;

  public readonly form: FormGroup = this.fb.group({
    name: [this.data.level?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: [this.data.level?.description || '', [Validators.maxLength(100)]],
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
      const payload: Partial<Level> = {
        name: rawValue.name.trim().toUpperCase(),
        description: rawValue.description?.trim() || '',
      };

      if (this.data.mode === 'create') {
        await this.levelService.createLevel({
          ...payload,
          enabled: true,
        });
      } else if (this.data.level?.id) {
        await this.levelService.updateLevel(this.data.level.id, payload);
      }

      this.dialogRef.close(true);
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.message || 'Error al guardar el nivel educativo.';
    } finally {
      this.isSaving = false;
    }
  }

  public close(): void {
    this.dialogRef.close(false);
  }
}
