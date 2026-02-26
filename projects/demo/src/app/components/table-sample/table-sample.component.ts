import { Component, effect, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { CustomerService } from '../../services/customer.service';
import { Command0 } from 'ng-bootstrap-addons/utils';
import { Customer, Representative } from '../../models/customer';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TableDirective } from './directives/table.directive';
import { InputComponent } from 'project/inputs/src/public_api';
import { ColumnFilterPredicate, ColumnToOptionDirective, TableModule } from 'ng-bootstrap-addons/table';
import { MultiselectOption } from 'ng-bootstrap-addons/selects';

@Component({
  selector: 'app-table-sample',
  imports: [TableModule, SampleContainerComponent, FormsModule, DatePipe, TableDirective, ColumnToOptionDirective, InputComponent],
  providers: [CustomerService],
  templateUrl: './table-sample.component.html',
})
export class TableSampleComponent {

  selectedRepresentative: string[] = [];
  selectedRows = signal<Customer[]>([]);

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

  list = signal<Customer[]>([]);

  constructor(private customerService: CustomerService){
      this.loadCommand = new Command0<Customer[]>(() => this.customerService.getCustomers());
      this.loadCommand.execute();
      effect(() => {
        this.list.set(this.loadCommand.finalResult() ?? []);
      });
      this.representativeOptions = this.representative.map(rep => {
        return new MultiselectOption<string>({
          value: rep.name!,
          label: rep.name!,
        });
      });
  }

  filterByRepresentative:ColumnFilterPredicate<string> = (item, value) => {
    if (value.length === 0) {
      return true;
    }
    return item.includes(value);
  };

  cast = (value: unknown): Customer[] => value as Customer[];

  removeCustomer(customer: Customer | Customer[]) {
    if (Array.isArray(customer)) {
      this.list.update(currentValue => 
        currentValue.filter(item => !customer.some(c => c.id === item.id))
      );
      this.selectedRows.update(selected => 
        selected.filter(item => !customer.some(c => c.id === item.id))
      );
      return;
    }
    this.list.update(currentValue => 
      currentValue.filter(item => item.id !== customer.id)
    );
    this.selectedRows.update(selected => 
      selected.filter(item => item.id !== customer.id)
    );
  }

  onDoubleClick(){
    console.log('Estive aqui')
  }

}
