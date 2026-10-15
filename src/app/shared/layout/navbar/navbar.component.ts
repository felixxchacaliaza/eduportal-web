// src/app/shared/components/navbar/navbar.component.ts
import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  // Emisor de evento funcional hacia el padre para alternar el menú lateral:
  public readonly toggleSidebar = output<void>();

  public onToggleClick(): void {
    this.toggleSidebar.emit();
  }
}
