import { Component, effect, OnInit } from '@angular/core';
import { Command0 } from 'ng-bootstrap-addons/utils';
import { ComponentNavigationService } from 'project/services/src/component-navigation.service';
import { Customer } from 'projects/demo/src/app/models/customer';
import { CustomerService } from 'projects/demo/src/app/services/customer.service';
import FormCustomerComponent from '../form-customer/form-customer.component';
import { PageStateDirective } from 'project/directives/src/page-state.directive';

@Component({
  selector: 'app-customer-card-list',
  imports: [],
  templateUrl: './customer-card-list.component.html',
})
export class CustomerCardListComponent extends PageStateDirective<{name:string}> implements OnInit {

  loadCommand: Command0<Customer[]>;
  customer = {} as Customer;

  constructor(
    private customerService: CustomerService,
    private navigationService: ComponentNavigationService,
  ) {
    super();
    this.loadCommand = new Command0<Customer[]>(() => this.customerService.getCustomers());
    this.loadCommand.execute();
  }

  ngOnInit() {
    console.log(this.state);
  }

  editCustomer(customer: Customer) {
    if (!customer?.id) return;
    this.navigationService.go(FormCustomerComponent, customer);
  }

}
