import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'nba-multiselect-option',
  imports: [CommonModule],
  templateUrl: './multiselect-option.component.html',
  styleUrl: './multiselect-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiselectOptionComponent {
  isSelected = input(false, {transform: booleanAttribute})
  toggle = output<boolean>();
  id = input.required<string>();
  label = input.required<string>();
}
