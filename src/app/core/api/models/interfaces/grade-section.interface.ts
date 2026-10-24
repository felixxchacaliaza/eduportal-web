import { Grade } from './grade.interface';

/**
 * ============================================================================
 * GradeSection, Classroom & Section Contracts (Core API)
 * ============================================================================
 * Contratos inmutables de las entidades académicas del módulo.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS:
 * 1. `Classroom.capacity`:
 *    - Capacidad física real del aula (carpetas disponibles según infraestructura).
 * 2. `GradeSection`:
 *    - Entidad relacional que materializa un salón activo en un periodo escolar.
 *    - En MongoDB posee dos índices únicos compuestos:
 *      a) { grade: 1, section: 1, academicYear: 1 } (No duplicar sección en un grado)
 *      b) { classroom: 1, shift: 1, academicYear: 1 } (No superponer aulas en el mismo turno)
 * ============================================================================
 */

/** Sección alfabética (ej. 'A', 'B', 'C') */
export interface Section {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly enabled: boolean;
}

/** Aula Física del colegio (ej. 'Aula 101', 'Lab Ciencias') */
export interface Classroom {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  /** Capacidad física normada de estudiantes */
  readonly capacity: number;
  readonly floor?: string;
  readonly pavilion?: string;
  readonly enabled: boolean;
}

/** Tipos de turno escolar */
export type ShiftType = 'MAÑANA' | 'TARDE' | 'NOCHE';

/** Entidad de cruce: Grado + Sección + Aula Física + Turno para un año lectivo */
export interface GradeSection {
  readonly id: string;
  readonly code: string;
  readonly academicYear: string;
  readonly grade: Grade | string;
  readonly section: Section | string;
  readonly classroom?: Classroom | string;
  readonly shift: ShiftType;
  /** Aforo máximo de estudiantes asignado */
  readonly maxCapacity: number;
  readonly enrolledCount: number;
  readonly enabled: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}
