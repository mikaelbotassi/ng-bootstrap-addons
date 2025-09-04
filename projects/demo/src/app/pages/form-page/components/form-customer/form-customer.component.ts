import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from 'ng-bootstrap-addons/inputs';
import { AutoCompleteLovComponent } from 'project/inputs/src/ac-search-lov';
import { SelectComponent } from 'project/selects/src/public_api';
import { Customer, Representative } from 'projects/demo/src/app/models/customer';

@Component({
  selector: 'app-form-customer',
  imports: [AutoCompleteLovComponent, InputComponent, SelectComponent, FormsModule],
  templateUrl: './form-customer.component.html',
})
export class FormCustomerComponent {

  customer = model<Customer>({
    id: undefined,
    name: undefined,
    representative: undefined
  });

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
  
}
