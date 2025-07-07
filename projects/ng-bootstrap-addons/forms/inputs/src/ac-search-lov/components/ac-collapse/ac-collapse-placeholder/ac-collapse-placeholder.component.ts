import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutocompleteCardPlaceholderComponent } from '../../ac-card/ac-card-placeholder/ac-card-placeholder.component';

@Component({
  selector: 'nba-autocomplete-collapse-placeholder',
  imports: [AutocompleteCardPlaceholderComponent],
  templateUrl: './ac-collapse-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteCollapsePlaceholderComponent {

}
