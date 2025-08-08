import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { CustomerService } from '../../services/customer.service';
import { NumericIntervalInputComponent } from 'inputs/numeric-interval-input/numeric-interval-input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidatorService } from 'services/custom-validator.service';

@Component({
  selector: 'app-numeric-interval-input-sample',
  imports: [SampleContainerComponent, NumericIntervalInputComponent, ReactiveFormsModule],
  providers: [CustomerService],
  templateUrl: './numeric-interval-input-sample.component.html',
})
export class NumericIntervalInputSampleComponent {

  constructor(private formMessage: CustomValidatorService){}

  value = new FormControl<(number | null)[] | null>(null, {validators: [Validators.required
  ]});



}
