import { IPerson } from './person.interface';

/**
 * ============================================================================
 * Guardian Interfaces
 * ============================================================================
 * Tipos y contratos para apoderados y familiares vinculados a un alumno.
 * ============================================================================
 */

export type GuardianRelationshipType = 'PADRE' | 'MADRE' | 'TUTOR' | 'APODERADO';

export interface IGuardianSubdoc {
  person: IPerson;
  relationship: GuardianRelationshipType;
  isPrimary: boolean;
}

export interface IGuardianFormItemDto {
  dni: string;
  firstName: string;
  lastName: string;
  relationship: GuardianRelationshipType;
  isPrimary: boolean;
  phone?: string;
  email?: string;
}
