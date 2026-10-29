import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { User } from '../../models';

/**
 * ============================================================================
 * UserListComponent
 * ============================================================================
 * Componente Dumb para la visualización tabular de cuentas de usuario.
 * ============================================================================
 */
@Component({
  selector: 'app-user-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  public readonly users = input.required<readonly User[]>();

  public readonly edit = output<User>();
  public readonly toggle = output<User>();

  public readonly displayedColumns: string[] = [
    'code',
    'person',
    'email',
    'profile',
    'status',
    'actions'
  ];

  public onEdit(user: User): void {
    this.edit.emit(user);
  }

  public onToggle(user: User): void {
    this.toggle.emit(user);
  }
}
