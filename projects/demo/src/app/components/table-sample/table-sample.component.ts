import { Component } from '@angular/core';
import { TableComponent } from 'project/table/src/table.component';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { CustomerService } from '../../services/customer.service';
import { Command0 } from 'ng-bootstrap-addons/utils';
import { Customer } from '../../models/customer';
import { FormsModule } from '@angular/forms';
import { ColumnHeaderComponent } from 'table/components/column-header/column-header.component';

@Component({
  selector: 'app-table-sample',
  imports: [TableComponent, ColumnHeaderComponent, SampleContainerComponent, FormsModule],
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
