import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from 'ng-bootstrap-addons/inputs';
import { PageStateDirective } from 'project/directives/src/page-state.directive';
import { AutoCompleteLovComponent } from 'project/inputs/src/ac-search-lov';
import { Customer, Representative } from 'projects/demo/src/app/models/customer';
import { CustomerService } from 'projects/demo/src/app/services/customer.service';

@Component({
  selector: 'app-form-customer',
  providers: [CustomerService],
  imports: [AutoCompleteLovComponent, InputComponent, FormsModule],
  templateUrl: './form-customer.component.html',
})
export default class FormCustomerComponent extends PageStateDirective<Customer> {

  private customerService = inject(CustomerService);

  representatives: Representative[] = [
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

  constructor(){
    super();
  }

}
