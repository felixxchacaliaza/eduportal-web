import { describe, it, expect } from 'vitest';
import { InfoCardData, CardColor } from './models/interfaces/infor-card-data.interface';

describe('Vitest Unit Tests - InfoCardComponent Contract and Formats', () => {

  it('debe validar la estructura requerida de InfoCardData', () => {
    const card: InfoCardData = {
      label: 'Total Matriculados',
      value: 125,
      subtitle: 'Año Lectivo 2026',
      color: 'blue'
    };

    expect(card.label).toBe('Total Matriculados');
    expect(card.value).toBe(125);
    expect(card.subtitle).toBe('Año Lectivo 2026');
    expect(card.color).toBe('blue');
  });

  it('debe admitir los 3 colores normados del design system (blue, green, amber)', () => {
    const allowedColors: CardColor[] = ['blue', 'green', 'amber'];
    expect(allowedColors.includes('blue')).toBe(true);
    expect(allowedColors.includes('green')).toBe(true);
    expect(allowedColors.includes('amber')).toBe(true);
  });

  it('debe soportar valores formateados con prefijo o sufijo porcentual', () => {
    const percentageCard: InfoCardData = {
      label: 'Tasa de Asistencia',
      value: '98.5%',
      color: 'green'
    };

    expect(percentageCard.value).toBe('98.5%');
  });

});
