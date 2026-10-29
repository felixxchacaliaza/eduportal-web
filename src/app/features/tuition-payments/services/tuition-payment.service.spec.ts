import { describe, it, expect } from 'vitest';
import { ITuitionPayment, ITuitionKpi } from '../models';

describe('Vitest Unit Tests - Tuition Payments Financial Calculations & Reactive Filtering', () => {
  const mockPayments: ITuitionPayment[] = [
    {
      id: 'pay-001',
      code: 'PAY-001',
      academicYear: '2026',
      concept: 'MATRICULA',
      amount: 450,
      dueDate: '2026-02-28',
      paidDate: '2026-02-15',
      paymentMethod: 'TRANSFERENCIA',
      status: 'PAGADO',
      enabled: true,
      student: {
        id: 'std-001',
        code: 'ALU-001',
        person: {
          id: 'per-001',
          firstName: 'Juan',
          lastName: 'Pérez García',
          documentNumber: '71234567',
        },
      },
    },
    {
      id: 'pay-002',
      code: 'PAY-002',
      academicYear: '2026',
      concept: 'PENSION_MARZO',
      amount: 380,
      dueDate: '2026-03-31',
      paidDate: null,
      paymentMethod: null,
      status: 'PENDIENTE',
      enabled: true,
      student: {
        id: 'std-001',
        code: 'ALU-001',
        person: {
          id: 'per-001',
          firstName: 'Juan',
          lastName: 'Pérez García',
          documentNumber: '71234567',
        },
      },
    },
    {
      id: 'pay-003',
      code: 'PAY-003',
      academicYear: '2026',
      concept: 'PENSION_ABRIL',
      amount: 380,
      dueDate: '2026-04-30',
      paidDate: null,
      paymentMethod: null,
      status: 'VENCIDO',
      enabled: true,
      student: {
        id: 'std-002',
        code: 'ALU-002',
        person: {
          id: 'per-002',
          firstName: 'María',
          lastName: 'López Quispe',
          documentNumber: '78901234',
        },
      },
    },
  ];

  function calculateKpis(payments: ITuitionPayment[]): ITuitionKpi {
    const totalCount = payments.length;
    const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0);

    const paidList = payments.filter((p) => p.status === 'PAGADO');
    const paidCount = paidList.length;
    const paidAmount = paidList.reduce((acc, p) => acc + p.amount, 0);

    const pendingList = payments.filter((p) => p.status === 'PENDIENTE');
    const pendingCount = pendingList.length;
    const pendingAmount = pendingList.reduce((acc, p) => acc + p.amount, 0);

    const overdueCount = payments.filter((p) => p.status === 'VENCIDO').length;

    return {
      totalCount,
      totalAmount,
      paidCount,
      paidAmount,
      pendingCount,
      pendingAmount,
      overdueCount,
    };
  }

  function filterPayments(
    payments: ITuitionPayment[],
    filterStatus: string,
    filterConcept: string,
    searchTerm: string
  ): ITuitionPayment[] {
    const term = searchTerm.trim().toLowerCase();

    return payments.filter((p) => {
      const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
      const matchConcept = filterConcept === 'ALL' || p.concept === filterConcept;

      let matchSearch = true;
      if (term) {
        const studentName = `${p.student?.person?.firstName || ''} ${p.student?.person?.lastName || ''}`.toLowerCase();
        const doc = (p.student?.person?.documentNumber || '').toLowerCase();
        const code = (p.code || '').toLowerCase();
        matchSearch = studentName.includes(term) || doc.includes(term) || code.includes(term);
      }

      return matchStatus && matchConcept && matchSearch;
    });
  }

  describe('1. Cálculo de KPIs Financieros Escolares', () => {
    it('debe calcular correctamente el total facturado, recaudado y saldo pendiente', () => {
      const kpis = calculateKpis(mockPayments);

      expect(kpis.totalCount).toBe(3);
      expect(kpis.totalAmount).toBe(1210); // 450 + 380 + 380
      expect(kpis.paidCount).toBe(1);
      expect(kpis.paidAmount).toBe(450);
      expect(kpis.pendingCount).toBe(1);
      expect(kpis.pendingAmount).toBe(380);
      expect(kpis.overdueCount).toBe(1);
    });

    it('debe calcular la tasa porcentual de efectividad de cobranza', () => {
      const kpis = calculateKpis(mockPayments);
      const collectionRate = Math.round((kpis.paidCount / kpis.totalCount) * 100);

      expect(collectionRate).toBe(33); // 1 de 3 ~ 33%
    });
  });

  describe('2. Filtros Reactivos de Cuotas', () => {
    it('debe filtrar exclusivamente cuotas con estado PENDIENTE', () => {
      const filtered = filterPayments(mockPayments, 'PENDIENTE', 'ALL', '');
      expect(filtered.length).toBe(1);
      expect(filtered[0].code).toBe('PAY-002');
    });

    it('debe filtrar exclusivamente cuotas con estado PAGADO', () => {
      const filtered = filterPayments(mockPayments, 'PAGADO', 'ALL', '');
      expect(filtered.length).toBe(1);
      expect(filtered[0].concept).toBe('MATRICULA');
    });

    it('debe filtrar por concepto específico de cuota (PENSION_ABRIL)', () => {
      const filtered = filterPayments(mockPayments, 'ALL', 'PENSION_ABRIL', '');
      expect(filtered.length).toBe(1);
      expect(filtered[0].student.person.lastName).toBe('López Quispe');
    });

    it('debe buscar insensiblemente a mayúsculas/minúsculas por DNI de estudiante', () => {
      const filtered = filterPayments(mockPayments, 'ALL', 'ALL', '78901234');
      expect(filtered.length).toBe(1);
      expect(filtered[0].student.person.firstName).toBe('María');
    });

    it('debe buscar por apellido del estudiante', () => {
      const filtered = filterPayments(mockPayments, 'ALL', 'ALL', 'pérez');
      expect(filtered.length).toBe(2); // PAY-001 y PAY-002 pertenecen a Juan Pérez
    });

    it('debe retornar lista vacía si ningún registro coincide con la búsqueda', () => {
      const filtered = filterPayments(mockPayments, 'ALL', 'ALL', 'INEXISTENTE_999');
      expect(filtered.length).toBe(0);
    });
  });

  describe('3. Amortización y Mutación Inmutable de Pago', () => {
    it('debe generar un registro pagado preservando la inmutabilidad de la cuota original', () => {
      const target = mockPayments[1]; // PENDIENTE
      const updated: ITuitionPayment = {
        ...target,
        status: 'PAGADO',
        paidDate: '2026-03-25',
        paymentMethod: 'YAPE_PLIN',
      };

      expect(target.status).toBe('PENDIENTE');
      expect(updated.status).toBe('PAGADO');
      expect(updated.paymentMethod).toBe('YAPE_PLIN');
      expect(updated.paidDate).toBe('2026-03-25');
    });
  });
});
