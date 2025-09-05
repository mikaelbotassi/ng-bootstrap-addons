import { Component, effect, viewChild } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { Command0 } from 'project/utils/src/command';
import { CustomerCardListComponent } from './components/customer-card-list/customer-card-list.component';
import { FormCustomerComponent } from './components/form-customer/form-customer.component';

@Component({
  selector: 'app-form-page',
  providers: [CustomerService],
  imports: [CustomerCardListComponent, FormCustomerComponent],
  templateUrl: './form-page.component.html',
})
export class FormPageComponent {

  loadCommand: Command0<Customer[]>;
  customer = {} as Customer;
  private formCustomer = viewChild(FormCustomerComponent);

  constructor(private customerService: CustomerService) { 
    this.loadCommand = new Command0<Customer[]>(() => this.customerService.getCustomers());
    this.loadCommand.execute();
    effect(() => {
      const result = this.loadCommand.finalResult();
      if(result && result.length > 0) this.customer = result[0];
    });
  }

  changeCustomer(){
    if(!this.customer.id) return;
    this.formCustomer()?.getCustomerById(this.customer.id);
  }

}
