import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Profile } from '../../models';

/**
 * ============================================================================
 * ProfileListComponent
 * ============================================================================
 * Componente Dumb para la visualización tabular de perfiles RBAC.
 * ============================================================================
 */
@Component({
  selector: 'app-profile-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss'
})
export class ProfileListComponent {
  public readonly profiles = input.required<readonly Profile[]>();

  public readonly edit = output<Profile>();
  public readonly toggle = output<Profile>();

  public readonly displayedColumns: string[] = [
    'code',
    'name',
    'description',
    'permissionsCount',
    'status',
    'actions'
  ];

  public onEdit(profile: Profile): void {
    this.edit.emit(profile);
  }

  public onToggle(profile: Profile): void {
    this.toggle.emit(profile);
  }
}
