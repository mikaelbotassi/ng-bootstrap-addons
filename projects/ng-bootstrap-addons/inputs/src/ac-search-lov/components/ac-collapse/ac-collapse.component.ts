import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteCardComponent } from '../ac-card/ac-card.component';
import { AutocompleteCollapsePlaceholderComponent } from './ac-collapse-placeholder/ac-collapse-placeholder.component';
import { acMap } from '../../ac-search-lov.component';
import { EmptyDataComponent } from 'ng-bootstrap-addons/components';


@Component({
  selector: 'nba-autocomplete-collapse',
  imports: [AutocompleteCardComponent, EmptyDataComponent, AutocompleteCollapsePlaceholderComponent, ScrollingModule, CdkVirtualScrollViewport],
  templateUrl: './ac-collapse.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteCollapseComponent {
  icon = input<string>();
  title = input<string>('Selecione um item');
  onClose = output<void>();
  listOfValues = input<any[]>([]);
  onSelect = output<any>();
  map = input.required<acMap>()
  isLoading = input<boolean>(false);
  itemsLoaded = signal<boolean>(true);
  constructor(){
    effect(() => {
      const isLoading = this.isLoading();
      if(!isLoading) setTimeout(() => this.itemsLoaded.set(true), 1000);
      else this.itemsLoaded.set(false);
    });
  }
}
