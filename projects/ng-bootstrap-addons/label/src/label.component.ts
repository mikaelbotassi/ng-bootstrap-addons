import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, input, ViewEncapsulation } from '@angular/core';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-label',
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { 'collision-id': `ac-search-sample-${createRandomString(20)} ` },
})
export class LabelComponent {
  required = input(false, {transform: booleanAttribute});
  class = input<string>();
  for = input<string>();
}
