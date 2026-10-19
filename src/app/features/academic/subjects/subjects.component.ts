import { Component, inject } from '@angular/core';
import { SubjectsCardsComponent } from './components/subjects-cards/subjects-cards.component';
import { SubjectsFiltersComponent } from './components/subjects-filters/subjects-filters.component';
import { SubjectsTableComponent } from './components/subjects-table/subjects-table.component';
import { SubjectsPresenter } from './subjects.component.presenter';

@Component({
  imports: [SubjectsCardsComponent, SubjectsFiltersComponent, SubjectsTableComponent ],
  selector: 'app-subjects',
  styleUrl: './subjects.component.scss',
  templateUrl: './subjects.component.html',
  providers: [SubjectsPresenter]
})
export class SubjectsComponent {

private readonly subjectsPresenter = inject(SubjectsPresenter);
public readonly cards = this.subjectsPresenter.cards;



}
