import { Component, effect, OnInit } from '@angular/core';
import { Command0 } from 'ng-bootstrap-addons/utils';
import { Customer } from 'projects/demo/src/app/models/customer';
import { CustomerService } from 'projects/demo/src/app/services/customer.service';
import FormCustomerComponent from '../form-customer/form-customer.component';
import { PageStateDirective } from 'project/directives/src/page-state.directive';
import { usePageState } from 'project/rxjs/src/use-page-state';

@Component({
  selector: 'app-customer-card-list',
  imports: [],
  templateUrl: './customer-card-list.component.html',
})
export class CustomerCardListComponent extends PageStateDirective<{name:string}> {

  loadCommand: Command0<Customer[]>;
  customer = {} as Customer;
  private readonly pageState = usePageState<{name:string}>();

  constructor(
    private customerService: CustomerService
  ) {
    super();
    this.loadCommand = new Command0<Customer[]>(() => this.customerService.getCustomers());
    this.loadCommand.execute();
  }

  editCustomer(customer: Customer) {
    if (!customer?.id) return;
    this.pageState.go(FormCustomerComponent, customer);
  }

}
