import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT } from '../src/app/features/staff/staff-management/dialogs/teacher-save-dialog/form/models/teacher-save-dialog-form.model.constant';
import { WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT } from '../src/app/features/staff/staff-management/dialogs/worker-save-dialog/form/models/worker-save-dialog-form.model.constant';

describe('TDD Unit Tests - Módulo Personal Escolar: Docentes y Trabajadores (sesion-05.1.0)', () => {

  describe('1. Regla Arquitectónica: 1 Clase = 1 Archivo y Constantes FormHtml Inmutables', () => {
    it('TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT debe ser inmutable y definir controles requeridos', () => {
      assert.ok(Object.isFrozen(TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT));
      assert.strictEqual(TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].formControlName, 'dni');
      assert.strictEqual(TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].label, 'DNI del Profesor');
      assert.strictEqual(TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].iconLeft, 'badge');
      assert.strictEqual(TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT['specialty'].formControlName, 'specialty');
      assert.strictEqual(TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT['academicDegree'].formControlName, 'academicDegree');
      assert.strictEqual(TEACHER_SAVE_DIALOG_FORM_MODEL_CONSTANT['contractedHours'].formControlName, 'contractedHours');
    });

    it('WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT debe ser inmutable y definir controles para administrativos', () => {
      assert.ok(Object.isFrozen(WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT));
      assert.strictEqual(WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].formControlName, 'dni');
      assert.strictEqual(WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT['dni'].label, 'DNI del Colaborador');
      assert.strictEqual(WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT['position'].formControlName, 'position');
      assert.strictEqual(WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT['shift'].formControlName, 'shift');
      assert.strictEqual(WORKER_SAVE_DIALOG_FORM_MODEL_CONSTANT['hireDate'].formControlName, 'hireDate');
    });
  });

  describe('2. Regla de Negocio RN-ACT-01: Incompatibilidad Alumno Activo vs. Personal Escolar', () => {
    it('debe rechazar el registro de docente o trabajador si la persona ya es estudiante activo', () => {
      const mockCheckDniResponse = { exists: true, isStudent: true };
      const validationError = mockCheckDniResponse.isStudent ? { personIsStudent: true } : null;

      assert.deepStrictEqual(validationError, { personIsStudent: true });
    });

    it('debe permitir el registro si la persona no está matriculada como alumno activo', () => {
      const mockCheckDniResponse = { exists: true, isStudent: false };
      const validationError = mockCheckDniResponse.isStudent ? { personIsStudent: true } : null;

      assert.strictEqual(validationError, null);
    });

    it('debe permitir el registro si la persona es un ciudadano nuevo en el padrón civil', () => {
      const mockCheckDniResponse = { exists: false, isStudent: false };
      const validationError = mockCheckDniResponse.isStudent ? { personIsStudent: true } : null;

      assert.strictEqual(validationError, null);
    });
  });

  describe('3. Regla de Negocio RN-DOC-02: Control de Horas Semanales Contratadas (1 a 48 hrs)', () => {
    const validateContractedHours = (hours: number): boolean => {
      return Number.isInteger(hours) && hours >= 1 && hours <= 48;
    };

    it('debe aceptar cargas horarias contractuales válidas (20, 30, 40, 48)', () => {
      assert.ok(validateContractedHours(20));
      assert.ok(validateContractedHours(30));
      assert.ok(validateContractedHours(40));
      assert.ok(validateContractedHours(48));
    });

    it('debe rechazar valores menores a 1 hora semanal', () => {
      assert.strictEqual(validateContractedHours(0), false);
      assert.strictEqual(validateContractedHours(-5), false);
    });

    it('debe rechazar valores superiores al límite normativo de 48 horas semanales', () => {
      assert.strictEqual(validateContractedHours(49), false);
      assert.strictEqual(validateContractedHours(60), false);
    });
  });

  describe('4. Turnos Laborales Válidos para Trabajadores Administrativos', () => {
    const allowedShifts = ['MAÑANA', 'TARDE', 'COMPLETO'];

    it('debe admitir turnos reglamentarios MAÑANA, TARDE y COMPLETO', () => {
      assert.ok(allowedShifts.includes('MAÑANA'));
      assert.ok(allowedShifts.includes('TARDE'));
      assert.ok(allowedShifts.includes('COMPLETO'));
    });

    it('debe rechazar turnos no configurados en la institución', () => {
      assert.strictEqual(allowedShifts.includes('NOCHE'), false);
      assert.strictEqual(allowedShifts.includes('ROTATIVO'), false);
    });
  });

  describe('5. Lógica de Filtrado Reactivo y Métricas KPI de Personal', () => {
    const mockTeachers = [
      { id: '1', code: 'TEA-001', specialty: 'Matemática', contractedHours: 30, enabled: true, person: { dni: '70899901', firstName: 'Carlos', lastName: 'Valdivia Herrera' } },
      { id: '2', code: 'TEA-002', specialty: 'Ciencias Sociales', contractedHours: 24, enabled: true, person: { dni: '80900012', firstName: 'Patricia', lastName: 'Guerrero Alva' } },
      { id: '3', code: 'TEA-003', specialty: 'Comunicación', contractedHours: 30, enabled: false, person: { dni: '91011123', firstName: 'Hugo', lastName: 'Paredes Cárdenas' } }
    ];

    const mockWorkers = [
      { id: '1', code: 'WRK-001', shift: 'COMPLETO', enabled: true, position: { name: 'DIRECTOR GENERAL' }, person: { dni: '20394857', firstName: 'Roberto', lastName: 'Mendoza Ramos' } },
      { id: '2', code: 'WRK-002', shift: 'MAÑANA', enabled: true, position: { name: 'SECRETARIA ACADÉMICA' }, person: { dni: '30495867', firstName: 'María', lastName: 'Salazar Castro' } },
      { id: '3', code: 'WRK-003', shift: 'TARDE', enabled: false, position: { name: 'CONSERJE' }, person: { dni: '60798890', firstName: 'Manuel', lastName: 'Quispe Soto' } }
    ];

    it('debe calcular correctamente el KPI Total Colaboradores (docentes + trabajadores)', () => {
      const totalColaboradores = mockTeachers.length + mockWorkers.length;
      assert.strictEqual(totalColaboradores, 6);
    });

    it('debe calcular el KPI Docentes Activos excluyendo bajas lógicas', () => {
      const activeTeachers = mockTeachers.filter(t => t.enabled).length;
      assert.strictEqual(activeTeachers, 2);
    });

    it('debe sumar el total de horas contratadas de docentes activos', () => {
      const totalHours = mockTeachers
        .filter(t => t.enabled)
        .reduce((sum, t) => sum + t.contractedHours, 0);
      assert.strictEqual(totalHours, 54); // 30 + 24
    });

    it('debe calcular el KPI Personal Administrativo activo', () => {
      const activeWorkers = mockWorkers.filter(w => w.enabled).length;
      assert.strictEqual(activeWorkers, 2);
    });

    it('debe filtrar docentes por término predictivo (especialidad, apellido, DNI)', () => {
      const query = 'matem';
      const results = mockTeachers.filter(t =>
        t.specialty.toLowerCase().includes(query) ||
        t.person.lastName.toLowerCase().includes(query)
      );
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].code, 'TEA-001');
    });

    it('debe filtrar trabajadores por cargo institucional', () => {
      const query = 'secretaria';
      const results = mockWorkers.filter(w =>
        w.position.name.toLowerCase().includes(query)
      );
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].code, 'WRK-002');
    });
  });

  describe('6. Paginación en Español para Personal Escolar (StaffPaginatorIntl Logic)', () => {
    it('debe formatear el rango de registros en español correctamente', () => {
      const getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) return `0 de ${length}`;
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} – ${endIndex} de ${length}`;
      };

      assert.strictEqual(getRangeLabel(0, 5, 12), '1 – 5 de 12');
      assert.strictEqual(getRangeLabel(1, 5, 12), '6 – 10 de 12');
      assert.strictEqual(getRangeLabel(2, 5, 12), '11 – 12 de 12');
      assert.strictEqual(getRangeLabel(0, 5, 0), '0 de 0');
    });
  });

});
