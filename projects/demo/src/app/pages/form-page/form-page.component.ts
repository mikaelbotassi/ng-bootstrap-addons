import { Component, effect } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { Command0 } from 'project/utils/src/command';
import { RouterOutlet } from '@angular/router';
import FormCustomerComponent from './components/form-customer/form-customer.component';
import { ComponentNavigationService } from 'project/services/src/component-navigation.service';

@Component({
  selector: 'app-form-page',
  providers: [CustomerService],
  imports: [RouterOutlet],
  templateUrl: './form-page.component.html',
})
export class FormPageComponent {

  loadCommand: Command0<Customer[]>;
  customer = {} as Customer;

  constructor(
    private customerService: CustomerService,
    private navigationService: ComponentNavigationService,
  ) { 
    this.loadCommand = new Command0<Customer[]>(() => this.customerService.getCustomers());
    this.loadCommand.execute();
    effect(() => {
      const result = this.loadCommand.finalResult();
      if(result && result.length > 0) this.customer = result[0];
    });
  }

  changeCustomer() {
    if (!this.customer?.id) return;
    this.navigationService.go(FormCustomerComponent, this.customer);
  }

  goBack() {
    this.navigationService.goBack();
  }

}
