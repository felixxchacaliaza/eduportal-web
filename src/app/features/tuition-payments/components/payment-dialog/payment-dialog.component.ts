import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { IPayTuitionDialogData, IPayTuitionRequest, PaymentMethodType } from '../../models';

/**
 * ============================================================================
 * PaymentDialogComponent (Registro y Amortización de Pago Escolar)
 * ============================================================================
 * Diálogo modal para registrar el cobro de pensión escolar o matrícula.
 *
 * Arquitectura:
 * - Angular 22 Zoneless nativo
 * - 1 Clase por archivo
 * ============================================================================
 */
@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
})
export class PaymentDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly dialogRef = inject(MatDialogRef<PaymentDialogComponent>);
  public readonly data = inject<IPayTuitionDialogData>(MAT_DIALOG_DATA);

  public form!: FormGroup;

  public readonly paymentMethods: { value: PaymentMethodType; label: string; icon: string }[] = [
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria', icon: 'account_balance' },
    { value: 'YAPE_PLIN', label: 'Billetera Digital (Yape / Plin)', icon: 'phone_android' },
    { value: 'EFECTIVO', label: 'Efectivo en Caja', icon: 'payments' },
    { value: 'TARJETA', label: 'Tarjeta Débito / Crédito', icon: 'credit_card' },
  ];

  public ngOnInit(): void {
    const today = new Date().toISOString().substring(0, 10);
    this.form = this.fb.group({
      paymentMethod: ['TRANSFERENCIA', [Validators.required]],
      paidDate: [today, [Validators.required]],
      operationNumber: [''],
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const payload: IPayTuitionRequest = {
      paymentMethod: val.paymentMethod,
      paidDate: val.paidDate,
      operationNumber: val.operationNumber?.trim() || undefined,
    };

    this.dialogRef.close(payload);
  }
}
