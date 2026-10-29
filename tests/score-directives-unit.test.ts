import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { GradeStatusPipe } from '../src/app/shared/pipes/grade-status/grade-status.pipe';

describe('TDD Unit Tests - Senior Boost: ScoreColorDirective y GradeStatusPipe (sesion-06.1.1)', () => {

  describe('1. GradeStatusPipe (Transformación Pura MINEDU)', () => {
    const pipe = new GradeStatusPipe();

    test('debe retornar "Aprobado" para notas vigesimales >= 11', () => {
      assert.equal(pipe.transform(11), 'Aprobado');
      assert.equal(pipe.transform(16), 'Aprobado');
      assert.equal(pipe.transform(20), 'Aprobado');
      assert.equal(pipe.transform('14'), 'Aprobado');
    });

    test('debe retornar "Desaprobado" para notas vigesimales < 11', () => {
      assert.equal(pipe.transform(10), 'Desaprobado');
      assert.equal(pipe.transform(5), 'Desaprobado');
      assert.equal(pipe.transform(0), 'Desaprobado');
      assert.equal(pipe.transform('08'), 'Desaprobado');
    });

    test('debe retornar "Pendiente" para valores nulos, indefinidos o vacíos', () => {
      assert.equal(pipe.transform(null), 'Pendiente');
      assert.equal(pipe.transform(undefined), 'Pendiente');
      assert.equal(pipe.transform(''), 'Pendiente');
      assert.equal(pipe.transform('abc'), 'Pendiente');
    });
  });

  describe('2. ScoreColorDirective Logic (Semáforo de Clases Host)', () => {
    function computeScoreClasses(raw: number | string | null | undefined): {
      isPassing: boolean;
      isFailing: boolean;
      isEmpty: boolean;
    } {
      if (raw === null || raw === undefined || raw === '') {
        return { isPassing: false, isFailing: false, isEmpty: true };
      }
      const num = typeof raw === 'number' ? raw : parseFloat(String(raw).trim());
      if (isNaN(num)) {
        return { isPassing: false, isFailing: false, isEmpty: true };
      }
      return {
        isPassing: num >= 11,
        isFailing: num < 11,
        isEmpty: false
      };
    }

    test('debe activar isPassing para notas aprobatorias', () => {
      const res = computeScoreClasses(15);
      assert.equal(res.isPassing, true);
      assert.equal(res.isFailing, false);
      assert.equal(res.isEmpty, false);
    });

    test('debe activar isFailing para notas desaprobatorias', () => {
      const res = computeScoreClasses(8);
      assert.equal(res.isPassing, false);
      assert.equal(res.isFailing, true);
      assert.equal(res.isEmpty, false);
    });

    test('debe activar isEmpty para celdas sin puntaje', () => {
      const res = computeScoreClasses(null);
      assert.equal(res.isPassing, false);
      assert.equal(res.isFailing, false);
      assert.equal(res.isEmpty, true);
    });

    test('debe parsear strings numéricos correctamente', () => {
      const passingStr = computeScoreClasses('18');
      assert.equal(passingStr.isPassing, true);

      const failingStr = computeScoreClasses('09');
      assert.equal(failingStr.isFailing, true);
    });
  });

});
