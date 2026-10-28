import { IPerson } from '../../../students/student-management/models/person.interface';
import { IPosition } from './position.interface';

export interface IWorker {
  id: string;
  person: IPerson;
  code: string;
  position: IPosition | string;
  shift?: 'MAÑANA' | 'TARDE' | 'COMPLETO';
  hireDate: string;
  enabled: boolean;
}

export interface ICreateWorkerRequestDto {
  dni: string;
  firstName: string;
  lastName: string;
  gender?: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  birthDate?: string;
  personalEmail?: string;
  phone?: string;
  address?: string;
  position: string;
  shift?: 'MAÑANA' | 'TARDE' | 'COMPLETO';
  hireDate: string;
}

export interface IUpdateWorkerRequestDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  position?: string;
  shift?: 'MAÑANA' | 'TARDE' | 'COMPLETO';
  hireDate?: string;
}
