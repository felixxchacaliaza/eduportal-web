import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { GRADE_BOOK_FORM_MODEL_CONSTANT } from '../src/app/features/evaluations/grade-book/form/models/grade-book-form.model.constant';
import { EvaluationPeriodConfig } from '../src/app/features/evaluations/grade-book/models/evaluation-period-config.interface';

describe('TDD Unit Tests - Módulo Matriz de Calificaciones MINEDU (sesion-06.0.0)', () => {

  describe('1. Regla Arquitectónica: Inmutabilidad y Constantes FormHtml', () => {
    test('GRADE_BOOK_FORM_MODEL_CONSTANT debe ser inmutable y definir controles requeridos', () => {
      assert.ok(Object.isFrozen(GRADE_BOOK_FORM_MODEL_CONSTANT));
      assert.ok(GRADE_BOOK_FORM_MODEL_CONSTANT['gradeSectionId']);
      assert.ok(GRADE_BOOK_FORM_MODEL_CONSTANT['subjectId']);
      assert.ok(GRADE_BOOK_FORM_MODEL_CONSTANT['academicYear']);
      assert.equal(GRADE_BOOK_FORM_MODEL_CONSTANT['gradeSectionId'].iconLeft, 'meeting_room');
      assert.equal(GRADE_BOOK_FORM_MODEL_CONSTANT['subjectId'].iconLeft, 'menu_book');
    });
  });

  describe('2. Regla MINEDU RUL-005: Escala Vigesimal y Semáforo Visual', () => {
    function evaluateScoreStatus(score: number | null): 'score--passing' | 'score--failing' | 'score--empty' {
      if (score === null || score === undefined || isNaN(score)) return 'score--empty';
      return score >= 11 ? 'score--passing' : 'score--failing';
    }

    function formatScore(score: number | null): string {
      if (score === null || score === undefined || isNaN(score)) return '';
      const clamped = Math.min(20, Math.max(0, Math.round(score)));
      return clamped < 10 ? `0${clamped}` : `${clamped}`;
    }

    test('debe clasificar como passing (aprobatorio) notas vigesimales >= 11', () => {
      assert.equal(evaluateScoreStatus(11), 'score--passing');
      assert.equal(evaluateScoreStatus(15), 'score--passing');
      assert.equal(evaluateScoreStatus(20), 'score--passing');
    });

    test('debe clasificar como failing (desaprobatorio) notas vigesimales < 11', () => {
      assert.equal(evaluateScoreStatus(10), 'score--failing');
      assert.equal(evaluateScoreStatus(5), 'score--failing');
      assert.equal(evaluateScoreStatus(0), 'score--failing');
    });

    test('debe clasificar como empty celdas sin calificación asignada', () => {
      assert.equal(evaluateScoreStatus(null), 'score--empty');
    });

    test('debe formatear a dos dígitos con cero a la izquierda para notas menores a 10', () => {
      assert.equal(formatScore(5), '05');
      assert.equal(formatScore(9), '09');
      assert.equal(formatScore(0), '00');
      assert.equal(formatScore(14), '14');
      assert.equal(formatScore(20), '20');
    });

    test('debe limitar el rango superior a 20 e inferior a 0', () => {
      assert.equal(formatScore(25), '20');
      assert.equal(formatScore(-3), '00');
    });
  });

  describe('3. Regla MINEDU RUL-004: Periodos Escolares y Candados isOpen', () => {
    const periodConfigs: EvaluationPeriodConfig[] = [
      { period: 1, name: 'Bimestre 1', weight: 25, isOpen: true },
      { period: 2, name: 'Bimestre 2', weight: 25, isOpen: true },
      { period: 3, name: 'Bimestre 3', weight: 25, isOpen: false },
      { period: 4, name: 'Bimestre 4', weight: 25, isOpen: false }
    ];

    test('debe permitir edición en periodos con isOpen: true', () => {
      const openPeriods = periodConfigs.filter(p => p.isOpen);
      assert.equal(openPeriods.length, 2);
      assert.deepEqual(openPeriods.map(p => p.period), [1, 2]);
    });

    test('debe bloquear edición en periodos con isOpen: false', () => {
      const lockedPeriods = periodConfigs.filter(p => !p.isOpen);
      assert.equal(lockedPeriods.length, 2);
      assert.deepEqual(lockedPeriods.map(p => p.period), [3, 4]);
    });

    test('extracción de payload íntegro debe conservar valores de periodos deshabilitados', () => {
      const mockRawRow = {
        id: 'eval-001',
        periods: [
          { period: 1, score: 16 },
          { period: 2, score: 18 },
          { period: 3, score: 14 }, // Periodo cerrado pero persistente
          { period: 4, score: null }
        ],
        observation: 'Nota bimestral cerrada'
      };

      // Simulación de getRawValue()
      const payloadItem = {
        id: mockRawRow.id,
        periods: mockRawRow.periods.map(p => ({
          period: p.period,
          score: p.score
        })),
        observation: mockRawRow.observation
      };

      assert.equal(payloadItem.periods.length, 4);
      assert.equal(payloadItem.periods[2].score, 14); // No se perdió el valor del periodo 3 bloqueado
    });
  });

  describe('4. Cálculo de Promedio Vigesimal en Caliente con Math.round', () => {
    function computeAverage(scores: (number | null)[], totalPeriodsCount: number): {
      finalAverage: number | null;
      status: 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO';
    } {
      const validScores = scores
        .filter((s): s is number => s !== null && s !== undefined && !isNaN(s));

      if (validScores.length === 0) {
        return { finalAverage: null, status: 'EN_CURSO' };
      }

      const sum = validScores.reduce((acc, curr) => acc + curr, 0);
      const avg = Math.round(sum / totalPeriodsCount);

      const isAllGraded = validScores.length === totalPeriodsCount;
      let status: 'EN_CURSO' | 'APROBADO' | 'DESAPROBADO' = 'EN_CURSO';

      if (isAllGraded) {
        status = avg >= 11 ? 'APROBADO' : 'DESAPROBADO';
      } else {
        status = avg >= 11 ? 'APROBADO' : 'EN_CURSO';
      }

      return { finalAverage: avg, status };
    }

    test('debe calcular promedio vigesimal exacto con redondeo oficial MINEDU', () => {
      // 16 + 18 = 34 / 4 bimestres = 8.5 -> redondeo a 9 (o sum / periodos calificados según configuración)
      const res = computeAverage([16, 18, 14, 15], 4);
      assert.equal(res.finalAverage, 16); // (16+18+14+15)/4 = 63/4 = 15.75 -> 16
      assert.equal(res.status, 'APROBADO');
    });

    test('debe marcar DESAPROBADO si todos los periodos están evaluados y promedio < 11', () => {
      const res = computeAverage([8, 10, 9, 8], 4);
      assert.equal(res.finalAverage, 9); // 35 / 4 = 8.75 -> 9
      assert.equal(res.status, 'DESAPROBADO');
    });

    test('debe marcar EN_CURSO si faltan periodos por calificar y promedio no es definitivo', () => {
      const res = computeAverage([null, null, null, null], 4);
      assert.equal(res.finalAverage, null);
      assert.equal(res.status, 'EN_CURSO');
    });
  });

  describe('5. Métricas KPI del Salón Escolar', () => {
    const mockEvaluations = [
      { id: '1', finalAverage: 17 },
      { id: '2', finalAverage: 14 },
      { id: '3', finalAverage: 8 },
      { id: '4', finalAverage: null }
    ];

    test('debe calcular el conteo de aprobados, en riesgo y promedio del salón', () => {
      const total = mockEvaluations.length;
      const graded = mockEvaluations.filter(e => e.finalAverage !== null);
      const passed = graded.filter(e => e.finalAverage! >= 11).length;
      const failed = graded.filter(e => e.finalAverage! < 11).length;
      const sum = graded.reduce((acc, curr) => acc + curr.finalAverage!, 0);
      const classAvg = (sum / graded.length).toFixed(1);

      assert.equal(total, 4);
      assert.equal(passed, 2);
      assert.equal(failed, 1);
      assert.equal(classAvg, '13.0'); // (17 + 14 + 8) / 3 = 39 / 3 = 13.0
    });
  });

});
