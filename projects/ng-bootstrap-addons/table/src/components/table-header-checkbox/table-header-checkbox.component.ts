import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { TableComponent } from '../../table.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'th[checkbox]',
  imports: [FormsModule],
  templateUrl: './table-header-checkbox.component.html',
  styles: `
    :host{ width: 2rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableHeaderCheckboxComponent {
  
  private table = inject(TableComponent);

  selected = computed(() => this.table.areAllRowsSelected());
  selectChange = output<boolean>();

  constructor(){
    this.selectChange.emit(this.table.areAllRowsSelected());
  }

  onSelectChange(event: boolean) {
    if(event) return this.table.selectAllRows();
    this.table.unselectAllRows();
  }

}
