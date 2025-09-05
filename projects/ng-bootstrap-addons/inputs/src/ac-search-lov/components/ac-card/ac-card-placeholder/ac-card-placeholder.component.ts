import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-autocomplete-card-placeholder',
  imports: [],
  templateUrl: './ac-card-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'collision-id': `ac-search-lov-card-placeholder-${createRandomString(20)} ` },
})
export class AutocompleteCardPlaceholderComponent {

}
