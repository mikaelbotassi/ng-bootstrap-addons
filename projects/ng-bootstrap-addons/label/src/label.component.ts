import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nba-label',
  imports: [CommonModule],
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LabelComponent {
  required = input(false, {transform: booleanAttribute});
  class = input<string>();
  for = input<string>();
}
