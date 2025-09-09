// column-filter-form.component.ts
import { ChangeDetectionStrategy, Component, contentChild, input, output, signal, TemplateRef } from '@angular/core';
import { DateRangePickerComponent, InputComponent, NumericIntervalInputComponent, SwitchComponent } from 'ng-bootstrap-addons/inputs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnFilterType, FilterFunction } from '../../models/table-models';
import { DateUtils } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-column-filter-form',
  imports: [CommonModule, InputComponent, DateRangePickerComponent, SwitchComponent, FormsModule, NumericIntervalInputComponent],
  templateUrl: './column-filter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnFilterFormComponent {
  template = contentChild<TemplateRef<any>>('filter');
  type = input<ColumnFilterType|null>(null);
  
  value = signal<any>(null);
  
  filter = output<FilterFunction|void>();
  onClearFilter = output<void>();
  dynamicFilter = input<TemplateRef<any>>();

  applyFilter() {
    if(this.dynamicFilter()) return this.filter.emit()
    if(this.value() == null || this.value() == undefined){
      this.clearFilter();
      return;
    }
    const filterFunction = this.getDefaultFilterFunction();

    const v = this.value();
    
    this.filter.emit((item: any) => filterFunction(item, v));
  }

  clearFilter() {
    this.value.set(null);
    this.onClearFilter.emit();
  }

  private getDefaultFilterFunction() : ((item: any, value: any) => boolean) {
    switch(this.type()) {
      case 'text':
        return (item: any, value: string) => {
          if (typeof item !== 'string') return false;
          if (!item) return false;
          if (!value) return true;
          return item?.toString().toLowerCase()?.includes(value?.toLowerCase());
        };
      case 'date':
        return (item: any, value: (Date | undefined)[] | undefined) => {
          if (!item) return false;
          if (!value) return true;
          if (!Array.isArray(value) || value.length !== 2) return true;
          const [start, end] = value;
          if (!start || !end) return true;
          if (!DateUtils.isDate(item)) return false;
          const dateItem = DateUtils.toDate(item);
          return dateItem >= start && dateItem <= end;
        };
      case 'numeric':
        return (item: any, value: (number|null)[] | null) => {
          if (typeof item !== 'number' || isNaN(item)) return false;
          if (!value || !Array.isArray(value)) return true;
          const initialValue = value[0];
          const finalValue = value[1];
          if (!initialValue && !finalValue) return true;
          if(item >= initialValue! && !finalValue) return true;
          if(!initialValue && item <= finalValue!) return true;
          return item >= initialValue! && item <= finalValue!;
        };
      case 'boolean':
        return (item: any, value: boolean) => {
          if(typeof item !== 'boolean') return false;
          console.log("🚀 ~ ColumnFilterFormComponent ~ getDefaultFilterFunction ~ item:", item)
          return item === value;
        };
      default:
        return () => true;
    }
  }
}