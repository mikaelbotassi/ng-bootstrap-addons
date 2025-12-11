import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteCardComponent } from '../ac-card/ac-card.component';
import { AutocompleteCollapsePlaceholderComponent } from './ac-collapse-placeholder/ac-collapse-placeholder.component';
import { EmptyDataComponent } from 'ng-bootstrap-addons/components';
import { AcMap } from '../../models/ac-models';
import { createRandomString } from 'ng-bootstrap-addons/utils';


@Component({
  selector: 'nba-autocomplete-collapse',
  imports: [AutocompleteCardComponent, EmptyDataComponent, AutocompleteCollapsePlaceholderComponent, ScrollingModule, CdkVirtualScrollViewport],
  templateUrl: './ac-collapse.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .collapse-bg{background-color:inherit;}
  `,
  host: { 'collision-id': `ac-search-lov--collapse${createRandomString(20)} ` },
})
export class AutocompleteCollapseComponent {
  icon = input<string>();
  title = input<string>('Selecione um item');
  onClose = output<void>();
  listOfValues = input<any[]>([]);
  onSelect = output<any>();
  map = input.required<AcMap>()
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
