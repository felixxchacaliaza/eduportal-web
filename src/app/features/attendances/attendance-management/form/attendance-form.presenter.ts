import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AttendanceFormModel } from './models/attendance-form.model';
import { AttendanceItemFormModel } from './models/attendance-item-form.model';
import { ATTENDANCE_FORM_MODEL_CONSTANT } from './models/attendance-form.model.constant';
import { AttendanceStatus } from '../models/attendance-status.type';
import { IAttendance } from '../models/attendance.interface';
import { BulkAttendanceRequestDto } from '../models/bulk-attendance-request.dto';

/**
 * ============================================================================
 * AttendanceFormPresenter
 * ============================================================================
 * Presentador de formulario reactivo para la gestión de asistencia diaria y FormArray.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class AttendanceFormPresenter {
  private readonly fb = inject(FormBuilder);

  public readonly headerModel = new AttendanceFormModel();
  public readonly constant = ATTENDANCE_FORM_MODEL_CONSTANT;

  public readonly form: FormGroup;
  public readonly itemsArray: FormArray<FormGroup>;

  public readonly totalCount = signal<number>(0);
  public readonly presentCount = signal<number>(0);
  public readonly lateCount = signal<number>(0);
  public readonly absentCount = signal<number>(0);
  public readonly justifiedCount = signal<number>(0);

  constructor() {
    this.itemsArray = this.fb.array<FormGroup>([]);

    this.form = this.fb.group({
      date: this.headerModel.date,
      gradeSection: this.headerModel.gradeSection,
      academicYear: this.headerModel.academicYear,
      items: this.itemsArray
    });

    this.itemsArray.valueChanges.subscribe(() => {
      this.recalculateCounts();
    });
  }

  /**
   * Carga la lista de alumnos matriculados y asocia registros previos si existen.
   */
  public populate(enrolledStudents: any[], existingAttendances: IAttendance[] = []): void {
    this.itemsArray.clear();

    const attendanceMap = new Map<string, IAttendance>();
    existingAttendances.forEach(att => {
      const stuObj = att.student as any;
      const studentId = typeof stuObj === 'object' && stuObj ? stuObj.id || stuObj._id : stuObj;
      if (studentId) {
        attendanceMap.set(studentId.toString(), att);
      }
    });

    enrolledStudents.forEach(stu => {
      const studentId = stu.id || stu._id;
      const person = stu.person || {};
      const fullName = `${person.lastName || ''}, ${person.firstName || ''}`.trim() || stu.code || 'Estudiante';
      const studentCode = stu.code || '';
      const studentDni = person.dni || '';

      const existing = attendanceMap.get(studentId?.toString());
      const status: AttendanceStatus = (existing?.status as AttendanceStatus) || 'PRESENTE';
      const observation = existing?.observation || '';

      const itemModel = new AttendanceItemFormModel();
      const group = this.fb.group({
        student: [studentId, itemModel.student[1]],
        studentCode: [studentCode],
        studentName: [fullName],
        studentDni: [studentDni],
        status: [status, itemModel.status[1]],
        observation: [observation]
      });

      this.itemsArray.push(group);
    });

    this.recalculateCounts();
  }

  /**
   * Marca a todos los estudiantes de la lista como PRESENTE.
   */
  public markAllPresent(): void {
    this.itemsArray.controls.forEach(ctrl => {
      ctrl.patchValue({ status: 'PRESENTE' }, { emitEvent: false });
    });
    this.itemsArray.updateValueAndValidity();
    this.recalculateCounts();
  }

  /**
   * Modifica el estado de asistencia de una fila específica.
   */
  public setStatus(index: number, status: AttendanceStatus): void {
    const control = this.itemsArray.at(index);
    if (control) {
      control.patchValue({ status });
    }
  }

  /**
   * Recalcula los totales en tiempo real para alimentar las KPI cards.
   */
  public recalculateCounts(): void {
    const items = this.itemsArray.getRawValue();
    this.totalCount.set(items.length);

    let pres = 0;
    let late = 0;
    let abs = 0;
    let just = 0;

    for (const item of items) {
      const status = item['status'] as AttendanceStatus;
      if (status === 'PRESENTE') pres++;
      else if (status === 'TARDANZA') late++;
      else if (status === 'FALTA') abs++;
      else if (status === 'JUSTIFICADO') just++;
    }

    this.presentCount.set(pres);
    this.lateCount.set(late);
    this.absentCount.set(abs);
    this.justifiedCount.set(just);
  }

  /**
   * Retorna el DTO limpio y tipado para la persistencia masiva.
   */
  public getRawPayload(registeredBy: string = '6ae22a93f42eeb593b08a2a9'): BulkAttendanceRequestDto {
    const raw = this.form.getRawValue();
    return {
      date: raw['date'],
      gradeSection: raw['gradeSection'],
      academicYear: raw['academicYear'] || '2026',
      registeredBy,
      attendances: this.itemsArray.controls.map(ctrl => {
        const val = ctrl.getRawValue();
        return {
          student: val['student'],
          status: val['status'],
          observation: val['observation'] || ''
        };
      })
    };
  }
}
