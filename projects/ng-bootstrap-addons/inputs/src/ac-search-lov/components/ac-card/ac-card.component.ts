import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcMap } from '../../models/ac-models';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-autocomplete-card',
  imports: [CommonModule],
  templateUrl: './ac-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ac-card.component.scss',
  host: { 'collision-id': `ac-search-lov-card-${createRandomString(20)} ` },
})
export class AutocompleteCardComponent {
  title = input<string>('Item');
  icon = input<string>();
  map = input.required<AcMap>();
  value = input.required<any>();
  mapItems = computed(() => Object.entries(this.map()));
  id = input.required<number>();
  editedTitle = computed(() => `${this.title()} ${this.id() + 1}`);
  onSelect = output<void>();
}
