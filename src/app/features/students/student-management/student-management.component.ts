import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentManagementPresenter } from './student-management.presenter';

/**
 * ============================================================================
 * StudentManagementComponent (Smart Component / Container)
 * ============================================================================
 * Contenedor orquestador de Gestión de Alumnos / Padrón de Estudiantes y Matrícula.
 * Sigue la misma estructura y diseño de ancho/alto que Grados y Secciones.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    InfoCardComponent,
    StudentListComponent,
  ],
  providers: [StudentManagementPresenter],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentManagementComponent implements OnInit {
  public readonly presenter = inject(StudentManagementPresenter);

  public ngOnInit(): void {
    this.presenter.loadStudents();
  }
}
