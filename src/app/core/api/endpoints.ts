import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  areas: `${environment.apiUrl}/areas`,
  subjects: `${environment.apiUrl}/subjects`,
  levels: `${environment.apiUrl}/levels`,
  grades: `${environment.apiUrl}/grades`,
  sections: `${environment.apiUrl}/sections`,
  classrooms: `${environment.apiUrl}/classrooms`,
  rules: `${environment.apiUrl}/rules`,
  academicYears: `${environment.apiUrl}/academic-years`,
  gradeSections: `${environment.apiUrl}/grade-sections`,
  gradeSubjects: `${environment.apiUrl}/grade-subjects`,
  menus: `${environment.apiUrl}/menus`,
  students: `${environment.apiUrl}/students`,
  persons: `${environment.apiUrl}/persons`,
  enrollments: `${environment.apiUrl}/enrollments`,
  positions: `${environment.apiUrl}/positions`,
  teachers: `${environment.apiUrl}/teachers`,
  workers: `${environment.apiUrl}/workers`,
} as const;
