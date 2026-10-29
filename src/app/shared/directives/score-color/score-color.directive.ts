import {
  Directive,
  computed,
  input
} from '@angular/core';

/**
 * ============================================================================
 * ScoreColorDirective
 * ============================================================================
 * Directiva de atributo semántica para aplicar semáforo vigesimal MINEDU.
 *
 * @remarks
 * Utiliza Angular 22 host: {} con Signal Inputs y computeds, eliminando
 * decoradores legados @HostBinding y asegurando reactividad pura Zoneless.
 *
 * Clases automáticas emitidas en el elemento host:
 * - `score--passing`: Nota vigesimal >= 11 (Aprobado / Verde esmeralda)
 * - `score--failing`: Nota vigesimal < 11 (Desaprobado / Rojo coral)
 * - `score--empty`: Valor nulo, indefinido o vacío (Gris neutro)
 * ============================================================================
 */
@Directive({
  selector: '[appScoreColor]',
  standalone: true,
  host: {
    '[class.score--passing]': 'isPassing()',
    '[class.score--failing]': 'isFailing()',
    '[class.score--empty]': 'isEmpty()'
  }
})
export class ScoreColorDirective {
  /** Entrada reactiva del puntaje */
  public readonly score = input<number | string | null | undefined>(null, {
    alias: 'appScoreColor'
  });

  /** Valor numérico normalizado */
  public readonly numericScore = computed<number | null>(() => {
    const raw = this.score();
    if (raw === null || raw === undefined || raw === '') {
      return null;
    }
    const num = typeof raw === 'number' ? raw : parseFloat(String(raw).trim());
    return isNaN(num) ? null : num;
  });

  public readonly isPassing = computed<boolean>(() => {
    const val = this.numericScore();
    return val !== null && val >= 11;
  });

  public readonly isFailing = computed<boolean>(() => {
    const val = this.numericScore();
    return val !== null && val < 11;
  });

  public readonly isEmpty = computed<boolean>(() => {
    return this.numericScore() === null;
  });
}
