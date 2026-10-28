import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { StudentsPresenter } from '../../students.presenter';
import { StudentListComponent } from '../../components/student-list/student-list.component';

/**
 * ============================================================================
 * StudentsPageComponent
 * ============================================================================
 * Contenedor Inteligente (Smart Component) para la gestión del Padrón y Matrícula.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Component({
  selector: 'app-students-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    StudentListComponent,
  ],
  providers: [StudentsPresenter],
  templateUrl: './students-page.component.html',
  styleUrl: './students-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsPageComponent implements OnInit {
  public readonly presenter = inject(StudentsPresenter);

  public ngOnInit(): void {
    this.presenter.loadStudents();
  }

  public onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.presenter.setSearchTerm(value);
  }

  public clearSearch(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.presenter.setSearchTerm('');
  }
}
