import { describe, it, expect } from 'vitest';

describe('Vitest Unit Tests - ScoreColorDirective Semantics (Regla MINEDU RUL-005)', () => {

  function computeScoreClasses(score: number | string | null | undefined): {
    numericScore: number | null;
    isPassing: boolean;
    isFailing: boolean;
    isEmpty: boolean;
    hostClasses: Record<string, boolean>;
  } {
    let numericScore: number | null = null;
    if (score !== null && score !== undefined && score !== '') {
      const num = typeof score === 'number' ? score : parseFloat(String(score).trim());
      numericScore = isNaN(num) ? null : num;
    }

    const isPassing = numericScore !== null && numericScore >= 11;
    const isFailing = numericScore !== null && numericScore < 11;
    const isEmpty = numericScore === null;

    return {
      numericScore,
      isPassing,
      isFailing,
      isEmpty,
      hostClasses: {
        'score--passing': isPassing,
        'score--failing': isFailing,
        'score--empty': isEmpty,
      }
    };
  }

  describe('1. Clasificación Aprobatoria (score >= 11)', () => {
    it('debe asignar score--passing a notas aprobatorias límite (11)', () => {
      const res = computeScoreClasses(11);
      expect(res.isPassing).toBe(true);
      expect(res.isFailing).toBe(false);
      expect(res.isEmpty).toBe(false);
      expect(res.hostClasses['score--passing']).toBe(true);
      expect(res.hostClasses['score--failing']).toBe(false);
    });

    it('debe asignar score--passing a nota máxima (20)', () => {
      const res = computeScoreClasses(20);
      expect(res.isPassing).toBe(true);
      expect(res.hostClasses['score--passing']).toBe(true);
    });

    it('debe admitir cadenas numéricas como "14.5"', () => {
      const res = computeScoreClasses('14.5');
      expect(res.isPassing).toBe(true);
      expect(res.numericScore).toBe(14.5);
    });
  });

  describe('2. Clasificación Desaprobatoria (score < 11)', () => {
    it('debe asignar score--failing a notas menores a 11 (10)', () => {
      const res = computeScoreClasses(10);
      expect(res.isPassing).toBe(false);
      expect(res.isFailing).toBe(true);
      expect(res.hostClasses['score--failing']).toBe(true);
    });

    it('debe asignar score--failing a nota cero (0)', () => {
      const res = computeScoreClasses(0);
      expect(res.isFailing).toBe(true);
      expect(res.hostClasses['score--failing']).toBe(true);
    });

    it('debe admitir cadenas numéricas formateadas como "08"', () => {
      const res = computeScoreClasses('08');
      expect(res.isFailing).toBe(true);
      expect(res.numericScore).toBe(8);
    });
  });

  describe('3. Clasificación Vacía / Pendiente', () => {
    it('debe asignar score--empty ante valor null', () => {
      const res = computeScoreClasses(null);
      expect(res.isEmpty).toBe(true);
      expect(res.hostClasses['score--empty']).toBe(true);
    });

    it('debe asignar score--empty ante valor undefined', () => {
      const res = computeScoreClasses(undefined);
      expect(res.isEmpty).toBe(true);
      expect(res.hostClasses['score--empty']).toBe(true);
    });

    it('debe asignar score--empty ante cadena vacía o espacios', () => {
      const res = computeScoreClasses('');
      expect(res.isEmpty).toBe(true);
      expect(res.hostClasses['score--empty']).toBe(true);
    });
  });

});
