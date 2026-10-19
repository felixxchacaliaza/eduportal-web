import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InfoCardComponent, InfoCardData } from '../../../../../shared/components/info-card/info-card.component';

@Component({
  selector: 'app-subjects-cards',
  imports: [InfoCardComponent],
  templateUrl: './subjects-cards.component.html',
  styleUrl: './subjects-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectsCardsComponent {


  public readonly cards = input.required<readonly InfoCardData[]>();
}
