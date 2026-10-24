/**
 * ============================================================================
 * Rule & RuleDataType (Core API Contracts)
 * ============================================================================
 * Representa los contratos de datos para la colección `rules` en MongoDB.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * - Esta colección almacena parámetros de configuración escolar dinámica.
 * - En lugar de "quemar" (hardcodear) en el frontend opciones como turnos,
 *   escalas de calificación o tipos de matrícula, se consultan desde aquí.
 * - La propiedad `isAnnual` indica si el parámetro puede variar año a año.
 * ============================================================================
 */

/** Tipos de datos soportados para la deserialización dinámica de reglas */
export type RuleDataType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ARRAY' | 'ARRAY_OBJECT' | 'OBJECT';

/** Contrato inmutable de una Regla del Sistema */
export interface Rule {
  /** Identificador único en MongoDB */
  readonly id: string;
  /** Código legible del parámetro (ej. 'RUL-001') */
  readonly code: string;
  /** Clave de negocio única para consultas directas (ej. 'SHIFTS') */
  readonly key: string;
  /** Nombre formal de la regla */
  readonly name: string;
  /** Descripción del alcance de la regla */
  readonly description: string;
  /** Indica si la regla depende del año escolar activo */
  readonly isAnnual: boolean;
  /** Tipo de dato para parseo seguro */
  readonly dataType: RuleDataType;
  /** Valor almacenado */
  readonly value: any;
  /** Año lectivo asociado (si aplica) */
  readonly activeYear?: string;
  /** Valor resuelto para el periodo actual */
  readonly currentValue?: any;
  /** Estado de habilitación */
  readonly enabled: boolean;
}
