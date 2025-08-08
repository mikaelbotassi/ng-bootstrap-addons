import { Component } from '@angular/core';
import { TableComponent } from 'project/table/src/table.component';
import { ColumnHeaderComponent } from 'project/table/src/column-header/column-header.component';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { CustomerService } from '../../services/customer.service';
import { Command0 } from 'ng-bootstrap-addons/utils';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-table-sample',
  imports: [TableComponent, ColumnHeaderComponent, SampleContainerComponent],
  providers: [CustomerService],
  templateUrl: './table-sample.component.html',
})
export class TableSampleComponent {
  loadCommand: Command0<Customer[]>;

  constructor(private customerService: CustomerService){
      this.loadCommand = new Command0<Customer[]>(() => this.customerService.getCustomers());
      this.loadCommand.execute();
  }

  cast = (value: unknown): Customer[] => value as Customer[];

}
