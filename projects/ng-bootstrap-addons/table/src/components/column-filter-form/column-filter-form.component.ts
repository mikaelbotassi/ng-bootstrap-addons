import { ChangeDetectionStrategy, Component, contentChild, inject, input, output, signal, TemplateRef } from '@angular/core';
import { DateRangePickerComponent, InputComponent, NumericIntervalInputComponent, SwitchComponent } from 'ng-bootstrap-addons/inputs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnFilterType, FilterFunction } from '../../models/table-models';
import { DateUtils } from 'ng-bootstrap-addons/utils';
import { FilterStateService } from '../../services/filter-state.service';

@Component({
  selector: 'nba-column-filter-form',
  imports: [CommonModule, InputComponent, DateRangePickerComponent, SwitchComponent, FormsModule, NumericIntervalInputComponent],
  templateUrl: './column-filter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnFilterFormComponent {
  state = inject(FilterStateService);
  template = contentChild<TemplateRef<any>>('filter');
  type = input<ColumnFilterType|null>(null);
  
  filter = output<FilterFunction|void>();
  onClearFilter = output<void>();
  dynamicFilter = input<TemplateRef<any>>();

  applyFilter() {
    if(this.dynamicFilter()) return this.filter.emit()
    if(this.state.value() == null || this.state.value() == undefined){
      this.clearFilter();
      return;
    }
    
    this.filter.emit(this.state.applyFilter(this.type()));
  }

  clearFilter() {
    this.state.clearFilter();
    this.onClearFilter.emit();
  }
  
}