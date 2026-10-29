import { describe, it, expect, beforeEach } from 'vitest';
import { GradeStatusPipe } from './grade-status.pipe';

describe('Vitest Unit Tests - GradeStatusPipe (Regla MINEDU RUL-005)', () => {
  let pipe: GradeStatusPipe;

  beforeEach(() => {
    pipe = new GradeStatusPipe();
  });

  it('debe instanciarse correctamente como pipe puro', () => {
    expect(pipe).toBeDefined();
  });

  describe('Evaluación de Notas Aprobatorias (>= 11)', () => {
    it('debe transformar 11 en "Aprobado"', () => {
      expect(pipe.transform(11)).toBe('Aprobado');
    });

    it('debe transformar 20 (nota máxima) en "Aprobado"', () => {
      expect(pipe.transform(20)).toBe('Aprobado');
    });

    it('debe transformar cadenas numéricas como "15" en "Aprobado"', () => {
      expect(pipe.transform('15')).toBe('Aprobado');
    });
  });

  describe('Evaluación de Notas Desaprobatorias (< 11)', () => {
    it('debe transformar 10 en "Desaprobado"', () => {
      expect(pipe.transform(10)).toBe('Desaprobado');
    });

    it('debe transformar 0 (nota mínima) en "Desaprobado"', () => {
      expect(pipe.transform(0)).toBe('Desaprobado');
    });

    it('debe transformar cadenas numéricas como "05" o "8" en "Desaprobado"', () => {
      expect(pipe.transform('05')).toBe('Desaprobado');
      expect(pipe.transform('8')).toBe('Desaprobado');
    });
  });

  describe('Manejo de Celdas Vacías y Valores Nulos', () => {
    it('debe retornar "Pendiente" ante null', () => {
      expect(pipe.transform(null)).toBe('Pendiente');
    });

    it('debe retornar "Pendiente" ante undefined', () => {
      expect(pipe.transform(undefined)).toBe('Pendiente');
    });

    it('debe retornar "Pendiente" ante cadena vacía', () => {
      expect(pipe.transform('')).toBe('Pendiente');
      expect(pipe.transform('   ')).toBe('Pendiente');
    });

    it('debe retornar "Pendiente" ante valores no numéricos', () => {
      expect(pipe.transform('N/A')).toBe('Pendiente');
    });
  });
});
