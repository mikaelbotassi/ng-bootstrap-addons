// column-filter-form.component.ts
import { Component, contentChild, input, output, signal, TemplateRef } from '@angular/core';
import { DatetimeRangePickerComponent, InputComponent, NumericIntervalInputComponent, SwitchComponent } from 'ng-bootstrap-addons/inputs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnFilterType } from '../../models/table-models';

@Component({
  selector: 'nba-column-filter-form',
  imports: [CommonModule, InputComponent, DatetimeRangePickerComponent, SwitchComponent, FormsModule, NumericIntervalInputComponent],
  templateUrl: './column-filter-form.component.html',
})
export class ColumnFilterFormComponent {
  template = contentChild<TemplateRef<any>>('filter');
  type = input.required<ColumnFilterType>();
  
  // ✅ Value que pode ser usado no ngModel do template
  value = signal<any>(null);
  
  // ✅ Função de filtro customizada que pode ser passada como input
  customFilterFn = input<(item: any, value: any) => boolean>();
  
  filter = output<{value: any, filterFn: (item: any) => boolean}>();
  dynamicFilter = input<TemplateRef<any> | null>(null);

  applyFilter() {
    // Usa função customizada se fornecida, senão usa a padrão
    const filterFunction = this.customFilterFn() || this.getDefaultFilterFunction();
    
    this.filter.emit({
      value: this.value(),
      filterFn: (item: any) => filterFunction(item, this.value())
    });
  }

  clearFilter() {
    this.value.set(null);
    this.applyFilter();
  }

  private getDefaultFilterFunction() {
    switch(this.type()) {
      case 'text':
        return (item: any, value: string) => {
          if (!value) return true;
          return item?.toString().toLowerCase()?.includes(value?.toLowerCase());
        };
      case 'date':
        return (item: any, value: (Date | undefined)[] | undefined) => {
          if (!value) return true;
          if (!Array.isArray(value) || value.length !== 2) return true;
          // Verifica se o item está dentro do intervalo de datas
          const [start, end] = value;
          if (!start || !end) return true;
          return item >= start && item <= end;
        };
      case 'numeric':
        return (item: any, value: any) => {
          if (value === null || value === undefined) return true;
          return item === value;
        };
      case 'boolean':
        return (item: any, value: any) => {
          if (value === null || value === undefined) return true;
          return item === value;
        };
      default:
        return () => true;
    }
  }
}