import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { acMap } from '../../ac-search-lov.component';

@Component({
  selector: 'nba-autocomplete-card',
  imports: [CommonModule],
  templateUrl: './ac-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ac-card.component.scss',
})
export class AutocompleteCardComponent {
  title = input<string>('Item');
  icon = input<string>();
  map = input.required<acMap>();
  value = input.required<any>();
  mapItems = computed(() => Object.entries(this.map()));
  id = input.required<number>();
  editedTitle = computed(() => `${this.title()} ${this.id() + 1}`);
  onSelect = output<void>();
}
