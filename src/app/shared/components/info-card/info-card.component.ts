import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { InfoCardData } from './models/interfaces/infor-card-data.interface';

export * from './models/interfaces/infor-card-data.interface';
export * from './models/types/card-color.type';

@Component({
  selector: 'app-info-card',
  imports: [MatCardModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
})
export class InfoCardComponent {
  public readonly data = input.required<InfoCardData>();
}
