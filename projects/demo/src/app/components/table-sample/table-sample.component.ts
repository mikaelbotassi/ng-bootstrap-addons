import { Component, signal } from '@angular/core';
import { TableComponent } from 'project/table/src/table.component';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { CustomerService } from '../../services/customer.service';
import { Command0 } from 'ng-bootstrap-addons/utils';
import { Customer, Representative } from '../../models/customer';
import { FormsModule } from '@angular/forms';
import { ColumnHeaderComponent } from 'table/components/column-header/column-header.component';
import { MultiselectComponent, MultiselectOption } from 'ng-bootstrap-addons/selects';
import { FilterFunction } from 'project/table/src/models/table-models';
import { DatePipe } from '@angular/common';
import { TableRowControlComponent } from 'project/table/src/components/table-row-control/table-row-control.component';
import { TableHeaderCheckboxComponent } from 'project/table/src/components/table-header-checkbox/table-header-checkbox.component';

@Component({
  selector: 'app-table-sample',
  imports: [TableComponent, ColumnHeaderComponent, SampleContainerComponent, FormsModule, MultiselectComponent, DatePipe, TableRowControlComponent, TableHeaderCheckboxComponent],
  providers: [CustomerService],
  templateUrl: './table-sample.component.html',
})
export class TableSampleComponent {

  selectedRepresentative: string[] = [];

  globalFilter = '';

  loadCommand: Command0<Customer[]>;
  representative: Representative[] = [
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
  ];

  representativeOptions!: MultiselectOption<string>[];

  constructor(private customerService: CustomerService){
      this.loadCommand = new Command0<Customer[]>(() => this.customerService.getCustomers());
      this.loadCommand.execute();
      this.representativeOptions = this.representative.map(rep => {
        return new MultiselectOption<string>({
          value: rep.name!,
          label: rep.name!,
        });
      });
  }

  filterByRepresentative:FilterFunction<string> = (item) => {
    if (this.selectedRepresentative.length === 0) {
      return true; // No filter applied
    }
    return this.selectedRepresentative.includes(item);
  };

  cast = (value: unknown): Customer[] => value as Customer[];

}
