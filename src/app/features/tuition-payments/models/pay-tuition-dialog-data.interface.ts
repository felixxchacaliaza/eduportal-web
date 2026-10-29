import { ITuitionPayment, PaymentMethodType } from './tuition-payment.interface';

export interface IPayTuitionDialogData {
  readonly payment: ITuitionPayment;
}

export interface IPayTuitionRequest {
  readonly paymentMethod: PaymentMethodType;
  readonly paidDate: string;
  readonly operationNumber?: string;
}
