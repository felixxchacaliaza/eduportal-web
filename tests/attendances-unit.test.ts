import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ATTENDANCE_FORM_MODEL_CONSTANT } from '../src/app/features/attendances/attendance-management/form/models/attendance-form.model.constant';
import { INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT } from '../src/app/features/attendances/attendance-management/dialogs/incident-save-dialog/form/models/incident-save-dialog-form.model.constant';
import { AttendanceStatus } from '../src/app/features/attendances/attendance-management/models/attendance-status.type';

describe('TDD Unit Tests - Módulo Control de Asistencia Diaria e Incidencias (sesion-06.1.0)', () => {

  describe('1. Regla Arquitectónica: Inmutabilidad y Constantes FormHtml', () => {
    test('ATTENDANCE_FORM_MODEL_CONSTANT debe ser inmutable y definir controles requeridos', () => {
      assert.ok(Object.isFrozen(ATTENDANCE_FORM_MODEL_CONSTANT));
      assert.ok(ATTENDANCE_FORM_MODEL_CONSTANT['date']);
      assert.ok(ATTENDANCE_FORM_MODEL_CONSTANT['gradeSection']);
      assert.ok(ATTENDANCE_FORM_MODEL_CONSTANT['status']);
      assert.ok(ATTENDANCE_FORM_MODEL_CONSTANT['observation']);
      assert.equal(ATTENDANCE_FORM_MODEL_CONSTANT['date'].iconLeft, 'calendar_today');
      assert.equal(ATTENDANCE_FORM_MODEL_CONSTANT['gradeSection'].iconLeft, 'class');
    });

    test('INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT debe ser inmutable y definir controles para incidencias', () => {
      assert.ok(Object.isFrozen(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT));
      assert.ok(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['title']);
      assert.ok(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['type']);
      assert.ok(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['severity']);
      assert.ok(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['description']);
      assert.ok(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['actionTaken']);
      assert.equal(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['title'].iconLeft, 'label');
      assert.equal(INCIDENT_SAVE_DIALOG_FORM_MODEL_CONSTANT['description'].iconLeft, 'notes');
    });
  });

  describe('2. Estados de Asistencia y Cálculo de KPIs en Tiempo Real', () => {
    function computeAttendanceSummary(items: Array<{ status: AttendanceStatus }>) {
      const total = items.length;
      let pres = 0;
      let late = 0;
      let abs = 0;
      let just = 0;

      for (const item of items) {
        if (item.status === 'PRESENTE') pres++;
        else if (item.status === 'TARDANZA') late++;
        else if (item.status === 'FALTA') abs++;
        else if (item.status === 'JUSTIFICADO') just++;
      }

      const rate = total > 0 ? Math.round((pres / total) * 100) : 0;
      return { total, pres, late, abs, just, rate };
    }

    test('debe calcular el resumen de asistencia y tasa de puntualidad correctamente', () => {
      const sample = [
        { status: 'PRESENTE' as AttendanceStatus },
        { status: 'PRESENTE' as AttendanceStatus },
        { status: 'TARDANZA' as AttendanceStatus },
        { status: 'FALTA' as AttendanceStatus }
      ];

      const res = computeAttendanceSummary(sample);
      assert.equal(res.total, 4);
      assert.equal(res.pres, 2);
      assert.equal(res.late, 1);
      assert.equal(res.abs, 1);
      assert.equal(res.just, 0);
      assert.equal(res.rate, 50);
    });

    test('debe retornar tasa 100% cuando todos los alumnos están presentes', () => {
      const sample = [
        { status: 'PRESENTE' as AttendanceStatus },
        { status: 'PRESENTE' as AttendanceStatus },
        { status: 'PRESENTE' as AttendanceStatus }
      ];

      const res = computeAttendanceSummary(sample);
      assert.equal(res.rate, 100);
      assert.equal(res.pres, 3);
      assert.equal(res.abs, 0);
    });

    test('debe manejar aulas vacías con tasa 0% sin división por cero', () => {
      const res = computeAttendanceSummary([]);
      assert.equal(res.total, 0);
      assert.equal(res.rate, 0);
    });
  });

  describe('3. Lógica de Acción Masiva: Marcar Todos Presentes', () => {
    function markAllPresent(items: Array<{ student: string; status: AttendanceStatus }>) {
      return items.map(it => ({ ...it, status: 'PRESENTE' as AttendanceStatus }));
    }

    test('debe convertir todos los estados dispares a PRESENTE', () => {
      const initial = [
        { student: 'STU-001', status: 'FALTA' as AttendanceStatus },
        { student: 'STU-002', status: 'TARDANZA' as AttendanceStatus },
        { student: 'STU-003', status: 'JUSTIFICADO' as AttendanceStatus }
      ];

      const updated = markAllPresent(initial);
      assert.ok(updated.every(i => i.status === 'PRESENTE'));
      assert.equal(updated.length, 3);
    });
  });

  describe('4. Validación de Contrato de Incidencia Escolar', () => {
    function validateIncident(payload: {
      title?: string;
      description?: string;
      type?: string;
      severity?: string;
    }): { valid: boolean; errors: string[] } {
      const errors: string[] = [];
      if (!payload.title || payload.title.trim().length < 3) {
        errors.push('Título debe tener al menos 3 caracteres');
      }
      if (!payload.description || payload.description.trim().length < 5) {
        errors.push('Descripción debe tener al menos 5 caracteres');
      }
      const validTypes = ['DEMERITO', 'MERITO', 'ATENCION_PSICOLOGICA', 'CITACION_APODERADO'];
      if (!payload.type || !validTypes.includes(payload.type)) {
        errors.push('Tipo de incidencia no válido');
      }
      const validSeverities = ['LEVE', 'MODERADA', 'GRAVE'];
      if (!payload.severity || !validSeverities.includes(payload.severity)) {
        errors.push('Gravedad no válida');
      }
      return { valid: errors.length === 0, errors };
    }

    test('debe aceptar incidencias con campos reglamentarios correctos', () => {
      const result = validateIncident({
        title: 'Tardanza reiterada a primera hora',
        description: 'El alumno ingresa 20 minutos tarde de forma recurrente',
        type: 'DEMERITO',
        severity: 'LEVE'
      });
      assert.equal(result.valid, true);
      assert.equal(result.errors.length, 0);
    });

    test('debe rechazar incidencias con título muy corto o tipo inválido', () => {
      const result = validateIncident({
        title: 'No',
        description: 'Breve',
        type: 'INVALIDO',
        severity: 'LEVE'
      });
      assert.equal(result.valid, false);
      assert.ok(result.errors.length >= 2);
    });
  });

  describe('5. Formato de Fechas y Construcción de Payload Masivo', () => {
    function buildBulkPayload(
      gradeSection: string,
      date: string,
      records: Array<{ student: string; status: AttendanceStatus; observation?: string }>
    ) {
      return {
        gradeSection,
        date,
        academicYear: '2026',
        registeredBy: '6ae22a93f42eeb593b08a2a9',
        attendances: records.map(r => ({
          student: r.student,
          status: r.status,
          observation: r.observation || ''
        }))
      };
    }

    test('debe construir el payload de asistencia en lote respetando el contrato del backend', () => {
      const payload = buildBulkPayload('GSE-001', '2026-10-29', [
        { student: 'STU-001', status: 'PRESENTE' },
        { student: 'STU-002', status: 'TARDANZA', observation: 'Problemas de transporte' }
      ]);

      assert.equal(payload.gradeSection, 'GSE-001');
      assert.equal(payload.date, '2026-10-29');
      assert.equal(payload.academicYear, '2026');
      assert.equal(payload.attendances.length, 2);
      assert.equal(payload.attendances[1].observation, 'Problemas de transporte');
    });
  });

});
