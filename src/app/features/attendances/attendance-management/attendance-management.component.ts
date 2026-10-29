import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceManagementPresenter } from './attendance-management.presenter';
import { AttendanceFormPresenter } from './form/attendance-form.presenter';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { AttendanceFiltersComponent } from './components/attendance-filters/attendance-filters.component';
import { AttendanceTableComponent } from './components/attendance-table/attendance-table.component';

/**
 * ============================================================================
 * AttendanceManagementComponent (Smart Container)
 * ============================================================================
 * Contenedor principal de la Matriz de Asistencia Diaria e Incidencias Escolares.
 *
 * @remarks
 * Provee:
 * - `AttendanceManagementPresenter` como cerebro orquestador desacoplado.
 * - `AttendanceFormPresenter` como gestor de la matriz reactiva y FormArray.
 * - Diseño de ancho completo (`width: 100%`) sin restricciones de centrado.
 * ============================================================================
 */
@Component({
  selector: 'app-attendance-management',
  standalone: true,
  imports: [
    CommonModule,
    InfoCardComponent,
    AttendanceFiltersComponent,
    AttendanceTableComponent
  ],
  templateUrl: './attendance-management.component.html',
  styleUrl: './attendance-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AttendanceFormPresenter,
    AttendanceManagementPresenter
  ]
})
export class AttendanceManagementComponent implements OnInit {
  public readonly presenter = inject(AttendanceManagementPresenter);

  public ngOnInit(): void {
    this.presenter.init();
  }
}
