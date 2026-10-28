import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { TeacherListComponent } from './components/teacher-list/teacher-list.component';
import { WorkerListComponent } from './components/worker-list/worker-list.component';
import { StaffManagementPresenter } from './staff-management.presenter';

/**
 * ============================================================================
 * StaffManagementComponent
 * ============================================================================
 * Contenedor inteligente (Smart Container) para la gestión integral de personal escolar.
 * Presenta navegación por pestañas reactivas (Docentes vs Trabajadores) y KPIs en tiempo real.
 * Regla de Arquitectura: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    InfoCardComponent,
    TeacherListComponent,
    WorkerListComponent
  ],
  providers: [StaffManagementPresenter],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffManagementComponent implements OnInit {
  public readonly presenter = inject(StaffManagementPresenter);

  public ngOnInit(): void {
    this.presenter.loadInitialData();
  }
}
