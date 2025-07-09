import { Component, OnInit } from '@angular/core';
import { FormErrorMessageComponent } from 'form-error-message/form-error-message.component';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-error-message-sample',
  imports: [FormErrorMessageComponent, SampleContainerComponent],
  templateUrl: './error-message-sample.component.html',
})
export class ErrorMessageSampleComponent implements OnInit {
  control = new FormControl(undefined, { validators: [Validators.required] });
  ngOnInit(): void {
    this.control.markAsTouched(); // Simulate user interaction to show the error message
  }
}
