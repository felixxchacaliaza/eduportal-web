import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserSaveDialogPresenter } from './user-save-dialog.presenter';
import { User, Profile, SaveUserDto } from '../../models';
import { Person } from '../../../../core/api/models/interfaces/person.interface';

export interface UserSaveDialogData {
  readonly user?: User;
  readonly persons: readonly Person[];
  readonly profiles: readonly Profile[];
}

/**
 * ============================================================================
 * UserSaveDialogComponent
 * ============================================================================
 * Diálogo modal para la creación y edición de cuentas de usuario web.
 * ============================================================================
 */
@Component({
  selector: 'app-user-save-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  providers: [UserSaveDialogPresenter],
  templateUrl: './user-save-dialog.component.html',
  styleUrl: './user-save-dialog.component.scss'
})
export class UserSaveDialogComponent implements OnInit {
  public readonly presenter = inject(UserSaveDialogPresenter);
  public readonly dialogRef = inject(MatDialogRef<UserSaveDialogComponent>);
  public readonly data = inject<UserSaveDialogData>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.presenter.initialize(this.data.user);
  }

  public onPersonSelected(personId: string): void {
    if (!this.presenter.isEditing()) {
      const selectedPerson = this.data.persons.find(p => p.id === personId);
      if (selectedPerson?.personalEmail) {
        this.presenter.form.patchValue({ email: selectedPerson.personalEmail });
      }
    }
  }

  public onSubmit(): void {
    const payload = this.presenter.validateAndGetPayload();
    if (payload) {
      this.dialogRef.close(payload);
    }
  }

  public onCancel(): void {
    this.dialogRef.close(null);
  }
}
