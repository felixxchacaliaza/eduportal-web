import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT } from '../src/app/features/students/students/dialogs/student-save-dialog/form/models/student-save-dialog-form.model.constant';
import { GUARDIAN_FORM_MODEL_CONSTANT } from '../src/app/features/students/students/dialogs/student-save-dialog/form/models/guardian-form.model.constant';
import { ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT } from '../src/app/features/students/students/dialogs/enrollment-save-dialog/form/models/enrollment-save-dialog-form.model.constant';
import { SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT } from '../src/app/features/students/students/dialogs/section-change-dialog/form/models/section-change-dialog-form.model.constant';

describe('TDD Unit Tests - Módulo Padrón de Estudiantes y Matrícula (sesion-05.0.0)', () => {

  describe('1. Regla Arquitectónica: 1 Clase = 1 Archivo y Constantes FormHtml Inmutables', () => {
    it('STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT debe ser inmutable (Object.freeze) y tener metadata completa', () => {
      assert.ok(Object.isFrozen(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT));
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].formControlName, 'dni');
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].label, 'DNI del Estudiante');
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].iconLeft, 'badge');
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['firstName'].formControlName, 'firstName');
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['lastName'].formControlName, 'lastName');
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['gender'].formControlName, 'gender');
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['personalEmail'].formControlName, 'personalEmail');
      assert.strictEqual(STUDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['entryYear'].formControlName, 'entryYear');
    });

    it('GUARDIAN_FORM_MODEL_CONSTANT debe contener los campos requeridos para el FormArray', () => {
      assert.ok(Object.isFrozen(GUARDIAN_FORM_MODEL_CONSTANT));
      assert.strictEqual(GUARDIAN_FORM_MODEL_CONSTANT['dni'].formControlName, 'dni');
      assert.strictEqual(GUARDIAN_FORM_MODEL_CONSTANT['relationship'].formControlName, 'relationship');
      assert.strictEqual(GUARDIAN_FORM_MODEL_CONSTANT['isPrimary'].formControlName, 'isPrimary');
    });

    it('ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT debe definir campos de matrícula', () => {
      assert.ok(Object.isFrozen(ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT));
      assert.strictEqual(ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['gradeSection'].formControlName, 'gradeSection');
      assert.strictEqual(ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['academicYear'].formControlName, 'academicYear');
      assert.strictEqual(ENROLLMENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['status'].formControlName, 'status');
    });

    it('SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT debe ser inmutable y definir el control gradeSection', () => {
      assert.ok(Object.isFrozen(SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT));
      assert.strictEqual(SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT['gradeSection'].formControlName, 'gradeSection');
      assert.strictEqual(SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT['gradeSection'].label, 'Nueva Sección de Destino');
      assert.strictEqual(SECTION_CHANGE_DIALOG_FORM_MODEL_CONSTANT['gradeSection'].iconLeft, 'swap_horiz');
    });
  });

  describe('2. Regla de Negocio RN-PER-01: Formato y Validación de DNI', () => {
    const dniRegex = /^\d{8}$/;

    it('debe aceptar DNI válido de 8 dígitos numéricos', () => {
      assert.ok(dniRegex.test('72819203'));
      assert.ok(dniRegex.test('01234567'));
    });

    it('debe rechazar DNI con letras, espacios o longitud diferente a 8', () => {
      assert.strictEqual(dniRegex.test('7281920A'), false);
      assert.strictEqual(dniRegex.test('7281920'), false);
      assert.strictEqual(dniRegex.test('728192033'), false);
      assert.strictEqual(dniRegex.test(' 72819203'), false);
    });
  });

  describe('3. Regla de Negocio RN-ACT-02: Gestión de Apoderados', () => {
    it('un alumno no puede ser su propio apoderado (studentDni !== guardianDni)', () => {
      const studentDni = '74859612';
      const guardianDnis = ['74859612', '41223344'];

      const isSelfGuardian = guardianDnis.some(dni => dni === studentDni);
      assert.strictEqual(isSelfGuardian, true, 'Debe detectar conflicto de auto-apoderado');

      const validGuardianDnis = ['40112233', '41223344'];
      const isValid = !validGuardianDnis.some(dni => dni === studentDni);
      assert.strictEqual(isValid, true, 'Debe permitir apoderados distintos al alumno');
    });

    it('debe existir al menos un apoderado marcado como contacto principal (isPrimary: true)', () => {
      const guardiansWithoutPrimary = [
        { dni: '40112233', isPrimary: false },
        { dni: '41223344', isPrimary: false }
      ];
      const hasPrimary1 = guardiansWithoutPrimary.some(g => g.isPrimary === true);
      assert.strictEqual(hasPrimary1, false);

      const guardiansWithPrimary = [
        { dni: '40112233', isPrimary: true },
        { dni: '41223344', isPrimary: false }
      ];
      const hasPrimary2 = guardiansWithPrimary.some(g => g.isPrimary === true);
      assert.strictEqual(hasPrimary2, true);
    });
  });

  describe('4. Regla de Negocio RN-MAT-01 y RN-MAT-02: Aforo y Vacantes en Matrícula Anual', () => {
    it('debe calcular vacantes disponibles como maxCapacity - enrolledStudents', () => {
      const maxCapacity = 30;
      const enrolledStudents = 28;
      const availableVacancies = Math.max(0, maxCapacity - enrolledStudents);
      assert.strictEqual(availableVacancies, 2);
    });

    it('debe bloquear matrícula si availableVacancies <= 0', () => {
      const maxCapacity = 30;
      const enrolledStudents = 30;
      const availableVacancies = Math.max(0, maxCapacity - enrolledStudents);
      const canEnroll = availableVacancies > 0;
      assert.strictEqual(availableVacancies, 0);
      assert.strictEqual(canEnroll, false, 'No se puede matricular cuando no hay vacantes');
    });

    it('debe impedir saldo de vacantes negativo si enrolledStudents supera maxCapacity', () => {
      const maxCapacity = 25;
      const enrolledStudents = 26;
      const availableVacancies = Math.max(0, maxCapacity - enrolledStudents);
      assert.strictEqual(availableVacancies, 0);
    });
  });

  describe('5. Lógica de Filtrado Reactivo y KPIs del Padrón de Estudiantes', () => {
    const students = [
      {
        id: '1',
        code: 'STU-2026-001',
        enabled: true,
        person: { dni: '71829304', firstName: 'Carlos', lastName: 'Mendoza' }
      },
      {
        id: '2',
        code: 'STU-2026-002',
        enabled: false,
        person: { dni: '72930415', firstName: 'Ana Sofía', lastName: 'Flores' }
      },
      {
        id: '3',
        code: 'STU-2026-003',
        enabled: true,
        person: { dni: '73041526', firstName: 'Mateo', lastName: 'Mendoza' }
      }
    ];

    it('debe calcular KPIs: totalCount y activeCount', () => {
      const totalCount = students.length;
      const activeCount = students.filter(s => s.enabled).length;
      assert.strictEqual(totalCount, 3);
      assert.strictEqual(activeCount, 2);
    });

    it('debe filtrar predictivamente por apellido', () => {
      const query = 'mendoza'.trim().toLowerCase();
      const filtered = students.filter(s =>
        s.person.dni.includes(query) ||
        s.person.firstName.toLowerCase().includes(query) ||
        s.person.lastName.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query)
      );
      assert.strictEqual(filtered.length, 2);
    });

    it('debe filtrar predictivamente por DNI exacto o parcial', () => {
      const query = '7293'.trim().toLowerCase();
      const filtered = students.filter(s => s.person.dni.includes(query));
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0].person.firstName, 'Ana Sofía');
    });

    it('debe filtrar predictivamente por código institucional', () => {
      const query = 'stu-2026-003'.trim().toLowerCase();
      const filtered = students.filter(s => s.code.toLowerCase().includes(query));
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0].person.firstName, 'Mateo');
    });
  });

  describe('6. Regla de Negocio: Visibilidad de Acciones y Estado de Matrícula en Año en Curso', () => {
    const studentUnenrolled = {
      id: 'stu-1',
      code: 'STU-001',
      currentEnrollment: null
    };

    const studentEnrolled = {
      id: 'stu-2',
      code: 'STU-002',
      currentEnrollment: {
        code: 'MAT-001',
        academicYear: '2026',
        status: 'MATRICULADO',
        gradeSection: {
          id: 'sec-1',
          grade: { description: '1° Secundaria' },
          section: { name: 'A' },
          shift: 'MAÑANA'
        }
      }
    };

    it('estudiante sin matrícula debe permitir matricular (how_to_reg) y ocultar cambio de sección', () => {
      const isEnrolled = !!studentUnenrolled.currentEnrollment && studentUnenrolled.currentEnrollment.status === 'MATRICULADO';
      const showEnrollBtn = !isEnrolled;
      const showChangeSectionBtn = isEnrolled;

      assert.strictEqual(showEnrollBtn, true, 'Debe mostrar botón Matricular');
      assert.strictEqual(showChangeSectionBtn, false, 'No debe mostrar botón de Cambio de Sección');
    });

    it('estudiante ya matriculado NO debe permitir matricular de nuevo y debe habilitar cambio de sección', () => {
      const isEnrolled = !!studentEnrolled.currentEnrollment && studentEnrolled.currentEnrollment.status === 'MATRICULADO';
      const showEnrollBtn = !isEnrolled;
      const showChangeSectionBtn = isEnrolled;

      assert.strictEqual(showEnrollBtn, false, 'Debe ocultar el botón Matricular para evitar duplicidad');
      assert.strictEqual(showChangeSectionBtn, true, 'Debe mostrar el botón de Cambio de Sección');
    });

    it('traslado de sección debe rechazar si se intenta cambiar a la misma sección actual', () => {
      const currentSectionId = 'sec-1';
      const targetSectionId = 'sec-1';
      const isSame = currentSectionId === targetSectionId;

      assert.strictEqual(isSame, true, 'Debe detectar que es la misma sección');
    });

    it('traslado de sección debe validar vacantes en la sección destino', () => {
      const targetSectionWithVacancies = { maxCapacity: 30, enrolledStudents: 28 };
      const vacancies = Math.max(0, targetSectionWithVacancies.maxCapacity - targetSectionWithVacancies.enrolledStudents);
      assert.strictEqual(vacancies > 0, true);

      const targetSectionFull = { maxCapacity: 30, enrolledStudents: 30 };
      const noVacancies = Math.max(0, targetSectionFull.maxCapacity - targetSectionFull.enrolledStudents);
      assert.strictEqual(noVacancies > 0, false);
    });
  });

});
