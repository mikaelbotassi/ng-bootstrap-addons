import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-input-placeholder',
  imports: [],
  templateUrl: './input-placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'collision-id': `input-placeholder-${createRandomString(20)} ` },
})
export class InputPlaceholderComponent {

}
