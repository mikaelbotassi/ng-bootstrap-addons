import { Component, effect, inject, signal } from '@angular/core';
import { Command0 } from 'ng-bootstrap-addons/utils';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MultiselectOption } from 'ng-bootstrap-addons/selects';
import { ColumnFilterPredicate, ColumnToOptionDirective, TableModule } from 'project/table/src/public_api';
import { NumericPipe } from 'ng-bootstrap-addons/pipes';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Customer, Representative } from '../../../models/customer';
import { CustomerService } from '../../../services/customer.service';
import { SampleContainerComponent } from '../../../containers/sample-container/sample-container.component';
import { TableDirective } from '../directives/table.directive';

@Component({
  selector: 'app-table-sample',
  imports: [TableModule, SampleContainerComponent, FormsModule, DatePipe, TableDirective, ColumnToOptionDirective, NumericPipe],
  providers: [CustomerService],
  templateUrl: './table-modal-sample.component.html',
})
export class TableModalSampleComponent {

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
