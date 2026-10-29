import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TuitionPaymentService } from '../../services/tuition-payment.service';
import { ITuitionPayment } from '../../models';
import { InfoCardComponent, InfoCardData } from '../../../../shared/components/info-card/info-card.component';
import { PaymentDialogComponent } from '../../components/payment-dialog/payment-dialog.component';

/**
 * ============================================================================
 * TuitionPaymentsListComponent (Módulo Financiero y Cobranzas)
 * ============================================================================
 * Gestión de pensiones escolares, cronograma de cuotas, recaudación y amortizaciones.
 *
 * Arquitectura:
 * - Angular 22 Zoneless con Signals reactivos
 * - 1 Clase por archivo
 * - Full-width layout
 * ============================================================================
 */
@Component({
  selector: 'app-tuition-payments-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    InfoCardComponent,
  ],
  templateUrl: './tuition-payments-list.component.html',
  styleUrl: './tuition-payments-list.component.scss',
})
export class TuitionPaymentsListComponent implements OnInit {
  public readonly tuitionService = inject(TuitionPaymentService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  public readonly displayedColumns: string[] = [
    'code',
    'student',
    'concept',
    'amount',
    'dueDate',
    'status',
    'paymentInfo',
    'actions',
  ];

  public readonly isLoading = this.tuitionService.loading;
  public readonly filteredPayments = this.tuitionService.filteredPayments;
  public readonly filterStatus = this.tuitionService.filterStatus;
  public readonly filterConcept = this.tuitionService.filterConcept;
  public readonly searchTerm = this.tuitionService.searchTerm;

  /** Tarjetas KPI de recaudación institucional */
  public readonly cards = computed<InfoCardData[]>(() => {
    const kpi = this.tuitionService.kpis();
    const paidAmount = kpi?.paidAmount || 0;
    const pendingAmount = kpi?.pendingAmount || 0;
    const overdueCount = kpi?.overdueCount || 0;
    const paidCount = kpi?.paidCount || 0;
    const totalCount = kpi?.totalCount || 0;

    return [
      {
        icon: 'account_balance_wallet',
        label: 'Total Recaudado',
        value: `S/ ${paidAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        indicator: `${paidCount} Cuotas Canceladas`,
        iconBgClass: 'bg-success-light',
        iconColorClass: 'text-success',
      },
      {
        icon: 'pending',
        label: 'Saldo Pendiente',
        value: `S/ ${pendingAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        indicator: `${kpi?.pendingCount || 0} Cuotas por Cobrar`,
        iconBgClass: 'bg-warning-light',
        iconColorClass: 'text-warning',
      },
      {
        icon: 'event_busy',
        label: 'Cuotas Vencidas',
        value: `${overdueCount}`,
        indicator: 'En Gestión de Cobranza',
        iconBgClass: 'bg-danger-light',
        iconColorClass: 'text-danger',
      },
      {
        icon: 'fact_check',
        label: 'Efectividad Cobranza',
        value: `${totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0}%`,
        indicator: `${paidCount} de ${totalCount} Registros`,
        iconBgClass: 'bg-primary-light',
        iconColorClass: 'text-primary',
      },
    ];
  });

  public async ngOnInit(): Promise<void> {
    await Promise.all([
      this.tuitionService.loadPayments(),
      this.tuitionService.loadKpis(),
    ]);
  }

  public onSearchChange(term: string): void {
    this.tuitionService.searchTerm.set(term);
  }

  public onStatusChange(status: string): void {
    this.tuitionService.filterStatus.set(status);
  }

  public onConceptChange(concept: string): void {
    this.tuitionService.filterConcept.set(concept);
  }

  public openPaymentDialog(payment: ITuitionPayment): void {
    const ref = this.dialog.open(PaymentDialogComponent, {
      width: '480px',
      data: { payment },
      disableClose: true,
    });

    ref.afterClosed().subscribe(async (payload) => {
      if (payload) {
        try {
          await this.tuitionService.registerPayment(payment.id, payload);
          this.snackBar.open('¡Pago registrado con éxito en el sistema!', 'Cerrar', {
            duration: 3500,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        } catch (err: any) {
          this.snackBar.open(`Error al registrar pago: ${err.message}`, 'Cerrar', {
            duration: 4000,
          });
        }
      }
    });
  }
}
