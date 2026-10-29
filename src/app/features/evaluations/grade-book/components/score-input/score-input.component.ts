import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  signal,
  computed
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScoreColorDirective } from '../../../../../../shared/directives/score-color/score-color.directive';

/**
 * ============================================================================
 * ScoreInputComponent (ControlValueAccessor)
 * ============================================================================
 * Componente de entrada para calificación vigesimal escolar (0 a 20).
 *
 * @remarks
 * Implementa:
 * - `ControlValueAccessor` para enlace bidireccional con Reactive Forms.
 * - `Validator` para validar el rango normativo MINEDU (0 a 20).
 * - Semáforo visual en caliente: Passing ($\ge 11$) vs Failing ($< 11$).
 * - Formateo automático con cero a la izquierda en blur (`05`, `09`).
 * ============================================================================
 */
@Component({
  selector: 'app-score-input',
  standalone: true,
  imports: [CommonModule, ScoreColorDirective],
  templateUrl: './score-input.component.html',
  styleUrls: ['./score-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScoreInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ScoreInputComponent),
      multi: true
    }
  ]
})
export class ScoreInputComponent implements ControlValueAccessor, Validator {
  /** Valor numérico actual de la calificación */
  public readonly score = signal<number | null>(null);

  /** Valor de texto mostrado en el input */
  public readonly displayValue = signal<string>('');

  /** Estado de deshabilitado del control */
  public readonly isDisabled = signal<boolean>(false);

  /** Estado visual de semáforo computado */
  public readonly statusClass = computed<'score--passing' | 'score--failing' | 'score--empty'>(() => {
    const val = this.score();
    if (val === null || val === undefined) return 'score--empty';
    return val >= 11 ? 'score--passing' : 'score--failing';
  });

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  // --------------------------------------------------------------------------
  // ControlValueAccessor Implementation
  // --------------------------------------------------------------------------
  public writeValue(value: number | null | undefined): void {
    if (value === null || value === undefined || isNaN(value)) {
      this.score.set(null);
      this.displayValue.set('');
    } else {
      const num = Math.min(20, Math.max(0, Math.round(Number(value))));
      this.score.set(num);
      this.displayValue.set(num < 10 ? `0${num}` : `${num}`);
    }
  }

  public registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // --------------------------------------------------------------------------
  // Validator Implementation
  // --------------------------------------------------------------------------
  public validate(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (val === null || val === undefined || val === '') return null;
    const num = Number(val);
    if (isNaN(num) || num < 0 || num > 20) {
      return { vigesimalRange: { value: val, min: 0, max: 20 } };
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let raw = target.value.trim();

    if (!raw) {
      this.score.set(null);
      this.displayValue.set('');
      this.onChange(null);
      return;
    }

    // Filtrar solo dígitos
    const digitsOnly = raw.replace(/\D/g, '');
    let num = Number(digitsOnly);

    if (num > 20) {
      num = 20;
    }

    this.score.set(num);
    this.displayValue.set(`${num}`);
    this.onChange(num);
  }

  public onBlur(): void {
    this.onTouched();
    const current = this.score();
    if (current !== null) {
      // Formatear a dos dígitos al salir
      const formatted = current < 10 ? `0${current}` : `${current}`;
      this.displayValue.set(formatted);
    } else {
      this.displayValue.set('');
    }
  }
}
