import { IPerson } from './person.interface';
import { IGuardianSubdoc, IGuardianFormItemDto } from './guardian.interface';
import { IEnrollment } from './enrollment.interface';

/**
 * ============================================================================
 * Student Interfaces & DTOs
 * ============================================================================
 * Contratos de datos del estudiante y payloads de creación/actualización.
 * ============================================================================
 */

export interface IStudent {
  id: string;
  code: string;
  person: IPerson;
  guardians: IGuardianSubdoc[];
  entryYear: string;
  enabled: boolean;
  currentEnrollment?: IEnrollment | null;
}

export interface ICreateStudentRequestDto {
  dni: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  personalEmail: string;
  phone?: string;
  address?: string;
  entryYear: string;
  guardians: IGuardianFormItemDto[];
}

export interface IUpdateStudentRequestDto {
  firstName?: string;
  lastName?: string;
  personalEmail?: string;
  phone?: string;
  address?: string;
  guardians?: IGuardianFormItemDto[];
  enabled?: boolean;
}
