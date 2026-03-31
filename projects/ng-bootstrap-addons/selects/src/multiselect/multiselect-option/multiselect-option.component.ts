import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-multiselect-option',
  imports: [CommonModule],
  templateUrl: './multiselect-option.component.html',
  styleUrl: './multiselect-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'collision-id': `multiselect-option-${createRandomString(10)} ` },
})
export class MultiselectOptionComponent {
  isSelected = input(false, {transform: booleanAttribute})
  toggle = output<boolean>();
  id = input.required<string>();
  label = input.required<string>();
}
