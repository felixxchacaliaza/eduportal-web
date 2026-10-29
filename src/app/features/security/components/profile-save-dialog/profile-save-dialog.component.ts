import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileSaveDialogPresenter } from './profile-save-dialog.presenter';
import { Profile, AccessLevel } from '../../models';
import { MenuNode } from '../../../../core/api/models/interfaces/menu-node.interface';

export interface ProfileSaveDialogData {
  readonly profile?: Profile;
  readonly menus: readonly MenuNode[];
}

/**
 * ============================================================================
 * ProfileSaveDialogComponent
 * ============================================================================
 * Diálogo modal para la creación y edición de perfiles institucionales con
 * matriz interactiva de asignación granular de permisos sobre menús.
 * ============================================================================
 */
@Component({
  selector: 'app-profile-save-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  providers: [ProfileSaveDialogPresenter],
  templateUrl: './profile-save-dialog.component.html',
  styleUrl: './profile-save-dialog.component.scss'
})
export class ProfileSaveDialogComponent implements OnInit {
  public readonly presenter = inject(ProfileSaveDialogPresenter);
  public readonly dialogRef = inject(MatDialogRef<ProfileSaveDialogComponent>);
  public readonly data = inject<ProfileSaveDialogData>(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.presenter.initialize(this.data.profile);
  }

  public setAccess(menuId: string, level: AccessLevel): void {
    if (this.presenter.isSuperAdmin()) return;
    this.presenter.setPermission(menuId, level);
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
