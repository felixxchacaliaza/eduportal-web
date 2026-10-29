export type TuitionConcept =
  | 'MATRICULA'
  | 'PENSION_MARZO'
  | 'PENSION_ABRIL'
  | 'PENSION_MAYO'
  | 'PENSION_JUNIO'
  | 'PENSION_JULIO'
  | 'PENSION_AGOSTO'
  | 'PENSION_SETIEMBRE'
  | 'PENSION_OCTUBRE'
  | 'PENSION_NOVIEMBRE'
  | 'PENSION_DICIEMBRE';

export type PaymentMethodType = 'EFECTIVO' | 'TRANSFERENCIA' | 'YAPE_PLIN' | 'TARJETA';

export type PaymentStatus = 'PENDIENTE' | 'PAGADO' | 'VENCIDO' | 'EXONERADO';

export interface ITuitionPaymentStudent {
  readonly id: string;
  readonly code: string;
  readonly person: {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly documentNumber: string;
  };
}

export interface ITuitionPayment {
  readonly id: string;
  readonly code: string;
  readonly student: ITuitionPaymentStudent;
  readonly enrollment?: string;
  readonly academicYear: string;
  readonly concept: TuitionConcept;
  readonly amount: number;
  readonly dueDate: string;
  readonly paidDate: string | null;
  readonly paymentMethod: PaymentMethodType | null;
  readonly status: PaymentStatus;
  readonly enabled: boolean;
}
