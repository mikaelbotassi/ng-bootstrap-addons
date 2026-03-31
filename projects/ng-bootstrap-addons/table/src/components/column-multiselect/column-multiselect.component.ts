import { Component, computed, effect, input, linkedSignal, model, signal } from '@angular/core';
import { Column } from '../../models/table-models';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { createRandomString } from 'ng-bootstrap-addons/utils';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'nba-col-multiselect',
  imports: [BsDropdownModule, FormsModule, CdkDrag, CdkDropList, CdkDragPreview],
  templateUrl: './column-multiselect.component.html',
})
export class ColumnMultiselectComponent {

  options = input<Column[]>([]);
  fmtOptions = linkedSignal<Column[]>(() => this.options());
  values = model<string[]>([]);
  filter = signal<string>('');
  filteredOptions = computed(() => {
    const options = this.fmtOptions();
    const filter = this.filter();
    if(!filter.length) return options;
    return options.filter(option => option.header.includes(filter))
  });

  onOptionsChange = effect(() => {
    const columns = this.options();
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

  drop(event: CdkDragDrop<string[]>){
    this.fmtOptions.update(options => {
      moveItemInArray(options, event.previousIndex, event.currentIndex);
      return [...options];
    });
    this.values.set([...this.fmtOptions().map(o=>o.field)]);
  }

}