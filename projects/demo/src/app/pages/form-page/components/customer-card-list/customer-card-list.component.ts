import { Component, input, output } from '@angular/core';
import { Customer } from 'projects/demo/src/app/models/customer';

@Component({
  selector: 'app-customer-card-list',
  imports: [],
  templateUrl: './customer-card-list.component.html',
})
export class CustomerCardListComponent {

  customers = input<Customer[]>([])
  editCustomer = output<Customer>();

}
