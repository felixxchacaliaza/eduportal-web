import { IPerson } from '../../../students/student-management/models/person.interface';

export interface ITeacher {
  id: string;
  person: IPerson;
  code: string;
  specialty: string;
  academicDegree?: string;
  contractedHours: number;
  assignedHours: number;
  enabled: boolean;
}

export interface ICreateTeacherRequestDto {
  dni: string;
  firstName: string;
  lastName: string;
  gender?: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  birthDate?: string;
  personalEmail?: string;
  phone?: string;
  address?: string;
  specialty: string;
  academicDegree?: string;
  contractedHours: number;
}

export interface IUpdateTeacherRequestDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  specialty?: string;
  academicDegree?: string;
  contractedHours?: number;
}
