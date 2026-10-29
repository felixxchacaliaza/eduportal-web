import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';

import { SecurityManagementPresenter } from './security-management.presenter';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';
import { MenuService } from '../../../../core/api/services/menu.service';
import { API_ENDPOINTS } from '../../../../core/api/endpoints';
import { ApiResponse } from '../../../../core/api/models/interfaces/api-response.interface';
import { IPerson as Person } from '../../../students/student-management/models/person.interface';
import { MenuNode } from '../../../../core/api/models/interfaces/menu-node.interface';
import { User, Profile, SaveUserDto, SaveProfileDto } from '../../models';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { ProfileListComponent } from '../../components/profile-list/profile-list.component';
import { UserSaveDialogComponent } from '../../components/user-save-dialog/user-save-dialog.component';
import { ProfileSaveDialogComponent } from '../../components/profile-save-dialog/profile-save-dialog.component';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';

/**
 * ============================================================================
 * SecurityManagementComponent
 * ============================================================================
 * Contenedor Smart para la administración de seguridad, usuarios y perfiles RBAC.
 * ============================================================================
 */
@Component({
  selector: 'app-security-management',
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    UserListComponent,
    ProfileListComponent,
    InfoCardComponent
  ],
  providers: [SecurityManagementPresenter],
  templateUrl: './security-management.component.html',
  styleUrl: './security-management.component.scss'
})
export class SecurityManagementComponent implements OnInit {
  public readonly presenter = inject(SecurityManagementPresenter);
  public readonly userService = inject(UserService);
  public readonly profileService = inject(ProfileService);
  private readonly menuService = inject(MenuService);
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  /** Catálogo auxiliar de personas y menús */
  public readonly persons = signal<readonly Person[]>([]);
  public readonly menus = signal<readonly MenuNode[]>([]);

  public async ngOnInit(): Promise<void> {
    await Promise.all([
      this.userService.loadAll(),
      this.profileService.loadAll(),
      this.loadPersons(),
      this.loadMenus()
    ]);
  }

  public onSearchChange(term: string): void {
    this.presenter.setSearchTerm(term);
  }

  public openCreateUser(): void {
    const dialogRef = this.dialog.open(UserSaveDialogComponent, {
      width: '600px',
      data: {
        persons: this.persons(),
        profiles: this.profileService.profiles()
      }
    });

    dialogRef.afterClosed().subscribe(async (payload: SaveUserDto | null) => {
      if (payload) {
        try {
          await this.userService.create(payload);
          this.snackBar.open('Cuenta de usuario creada exitosamente', 'Cerrar', { duration: 3000 });
        } catch (err: any) {
          const msg = err?.error?.message || 'Error al crear usuario';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      }
    });
  }

  public openEditUser(user: User): void {
    const dialogRef = this.dialog.open(UserSaveDialogComponent, {
      width: '600px',
      data: {
        user,
        persons: this.persons(),
        profiles: this.profileService.profiles()
      }
    });

    dialogRef.afterClosed().subscribe(async (payload: SaveUserDto | null) => {
      if (payload) {
        try {
          const id = user.id || user._id || '';
          await this.userService.update(id, payload);
          this.snackBar.open('Cuenta de usuario actualizada', 'Cerrar', { duration: 3000 });
        } catch (err: any) {
          const msg = err?.error?.message || 'Error al actualizar usuario';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      }
    });
  }

  public async onToggleUser(user: User): Promise<void> {
    if (user.isProtected) {
      this.snackBar.open('La cuenta raíz Super Usuario no puede ser desactivada (RN-SEG-02)', 'Cerrar', { duration: 4000 });
      return;
    }

    try {
      const id = user.id || user._id || '';
      await this.userService.toggle(id);
      this.snackBar.open('Estado de cuenta actualizado', 'Cerrar', { duration: 3000 });
    } catch (err: any) {
      const msg = err?.error?.message || 'Error al alternar estado de cuenta';
      this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
    }
  }

  public openCreateProfile(): void {
    const dialogRef = this.dialog.open(ProfileSaveDialogComponent, {
      width: '780px',
      data: {
        menus: this.menus()
      }
    });

    dialogRef.afterClosed().subscribe(async (payload: SaveProfileDto | null) => {
      if (payload) {
        try {
          await this.profileService.create(payload);
          this.snackBar.open('Perfil institucional creado exitosamente', 'Cerrar', { duration: 3000 });
        } catch (err: any) {
          const msg = err?.error?.message || 'Error al crear perfil';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      }
    });
  }

  public openEditProfile(profile: Profile): void {
    const dialogRef = this.dialog.open(ProfileSaveDialogComponent, {
      width: '780px',
      data: {
        profile,
        menus: this.menus()
      }
    });

    dialogRef.afterClosed().subscribe(async (payload: SaveProfileDto | null) => {
      if (payload) {
        try {
          const id = profile.id || profile._id || '';
          await this.profileService.update(id, payload);
          this.snackBar.open('Perfil y matriz RBAC actualizados', 'Cerrar', { duration: 3000 });
        } catch (err: any) {
          const msg = err?.error?.message || 'Error al actualizar perfil';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      }
    });
  }

  public async onToggleProfile(profile: Profile): Promise<void> {
    if (profile.isSuperAdmin) {
      this.snackBar.open('El perfil SuperAdmin no puede ser desactivado (RN-SEG-02)', 'Cerrar', { duration: 4000 });
      return;
    }

    try {
      const id = profile.id || profile._id || '';
      await this.profileService.toggle(id);
      this.snackBar.open('Estado de perfil actualizado', 'Cerrar', { duration: 3000 });
    } catch (err: any) {
      const msg = err?.error?.message || 'Error al alternar estado de perfil';
      this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
    }
  }

  private async loadPersons(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Person[]>>(API_ENDPOINTS.persons)
      );
      this.persons.set(res.data || []);
    } catch {
      this.persons.set([]);
    }
  }

  private async loadMenus(): Promise<void> {
    try {
      const tree = await this.menuService.getMenuTree();
      this.menus.set(tree || []);
    } catch {
      this.menus.set([]);
    }
  }
}
