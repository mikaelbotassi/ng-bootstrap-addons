import { NgModule } from '@angular/core';
import { TableComponent, ColumnFilterComponent, ColumnFilterFormComponent, ColumnHeaderComponent, ContextMenuComponent, TableHeaderCheckboxComponent, TableRowControlComponent } from '../public_api';

const components = [
  TableComponent,
  ColumnFilterComponent,
  ColumnFilterFormComponent,
  ColumnHeaderComponent,
  ContextMenuComponent,
  TableHeaderCheckboxComponent,
  TableRowControlComponent
];

@NgModule({
  imports: components,
  exports: components
})
export class TableModule { }
