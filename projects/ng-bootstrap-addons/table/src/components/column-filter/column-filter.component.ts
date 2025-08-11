import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { ColumnFilterFormComponent } from '../column-filter-form/column-filter-form.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ColumnFilterType, FilterFunction } from '../../models/table-models';

@Component({
  selector: 'nba-column-filter',
  templateUrl: './column-filter.component.html',
  styles: [`:host {display: contents}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ColumnFilterFormComponent, BsDropdownModule],
})
export class ColumnFilterComponent {

  type = input<ColumnFilterType|null>(null);
  field = input.required<string>();
  class = input<string | null>(null);
  isFiltered = input<boolean>(false);
  dynamicFilter = input<TemplateRef<any>>();

  filter = output<FilterFunction|void>();
  onClearFilter = output<void>();

}
