import { Component, computed, effect, input, model, signal, untracked } from '@angular/core';
import { ColumnFilterType } from '../../public_api';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-col-multiselect',
  imports: [BsDropdownModule, FormsModule],
  templateUrl: './column-multiselect.component.html',
})
export class ColumnMultiselectComponent {

 options = input<Column[]>([]);
 values = model<string[]>([]);
 filter = signal<string>('');
 filteredOptions = computed(() => {
  const options = this.options();
  const filter = this.filter();
  if(!filter.length) return options;
  return options.filter(option => option.header.includes(filter))
 });

 onOptionsChange = effect(() => {
    const columns = this.options();
    console.log('estive aqui')
    const selections = (columns?.filter((item) => item.visible ?? true) ?? []).map((item) => item.field);
    this.values.set(selections);
  });

  selectAllId = createRandomString(6);

  isAllChecked = () => this.options().every(o => this.values().includes(o.field));

  toggleAll = () => {
    if(this.isAllChecked()) return this.values.set([]);
    this.values.set(this.options().map(o=>o.field));
  }

  isChecked = (item:Column):boolean => this.values().includes(item.field)

  toggle = (item:Column) => {
    if(this.values().includes(item.field)){
      this.values.update(curr => curr.filter(value => value !== item.field))
      return;
    }
    this.values.update(curr => [...curr, item.field]);
  }

  reset = () => {
    this.values.set((this.options()?.filter((item) => item.visible ?? true) ?? []).map((item) => item.field))
  }

}

export interface Column{
  field:string;
  header:string;
  visible?: boolean;
  type?:ColumnFilterType
}