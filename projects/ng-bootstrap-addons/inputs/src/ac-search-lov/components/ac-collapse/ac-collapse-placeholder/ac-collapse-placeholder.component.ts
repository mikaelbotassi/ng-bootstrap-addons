import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutocompleteCardPlaceholderComponent } from '../../ac-card/ac-card-placeholder/ac-card-placeholder.component';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-autocomplete-collapse-placeholder',
  imports: [AutocompleteCardPlaceholderComponent],
  templateUrl: './ac-collapse-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'collision-id': `ac-search-lov-collapse-placeholder${createRandomString(20)} ` },
})
export class AutocompleteCollapsePlaceholderComponent {

}
