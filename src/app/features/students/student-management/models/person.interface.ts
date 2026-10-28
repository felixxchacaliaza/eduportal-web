/**
 * ============================================================================
 * Person Interfaces
 * ============================================================================
 * Contrato de datos para personas registradas en el padrón civil único.
 * ============================================================================
 */

export type GenderType = 'M' | 'F';

export interface IPerson {
  id: string;
  code: string;
  dni: string;
  firstName: string;
  lastName: string;
  gender: GenderType;
  personalEmail: string;
  phone?: string;
  address?: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICheckDniResponse {
  exists: boolean;
  isStudent: boolean;
  person?: IPerson;
}
