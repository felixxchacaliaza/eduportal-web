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
import { StudentsPresenter } from './students.presenter';

/**
 * ============================================================================
 * StudentsComponent (Smart Component / Container)
 * ============================================================================
 * Contenedor orquestador del Padrón de Estudiantes y Matrícula Anual.
 * Sigue la misma estructura y diseño de ancho/alto que Grados y Secciones.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-students',
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
  providers: [StudentsPresenter],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent implements OnInit {
  public readonly presenter = inject(StudentsPresenter);

  public ngOnInit(): void {
    this.presenter.loadStudents();
  }
}
