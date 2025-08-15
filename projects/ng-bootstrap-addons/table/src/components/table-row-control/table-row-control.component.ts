import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output } from '@angular/core';
import { TableComponent } from '../../table.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tr[nbaControl]',
  imports: [FormsModule],
  styleUrl: './table-row-control.component.scss',
  templateUrl: './table-row-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableRowControlComponent<T = any> {

  private table = inject(TableComponent<T>);
  
  value = input<T | null>(null);
  clickDelay = input<number>(220);
  selected = output<boolean>();
  multiple = computed(() => this.table.multiple());
  rowClick = output<void>();
  rowDoubleClick = output<void>();
  private clickTimer: any = null;
  isSelected = computed(() => {
    if (!this.value()) return false;
    return this.table.selectedRows().includes(this.value()!);
  });

  constructor(){
    effect(() => {
      this.selected.emit(this.isSelected());
    });
  }

  onClick(){
    if(this.clickTimer){
      clearTimeout(this.clickTimer);
      this.rowDoubleClick.emit();
      return;
    }
    this.clickTimer = setTimeout(() => {
      if(this.value()) this.table.selectRow(this.value()!);
      this.clickTimer = null;
      this.rowClick.emit();
    }, this.clickDelay());
  }

  onCheckboxChange(newValue: boolean) {
    if (newValue && this.value()) return this.table.selectRow(this.value()!);
  }

}
