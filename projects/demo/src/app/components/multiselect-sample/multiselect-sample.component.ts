import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { MultiselectComponent, MultiselectOption } from 'selects/multiselect/multiselect.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-multiselect-sample',
  imports: [SampleContainerComponent, MultiselectComponent, ReactiveFormsModule],
  templateUrl: './multiselect-sample.component.html',
})
export class MultiselectSampleComponent {
  control = new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] });
  options:MultiselectOption<string>[] = [
    {
      id: 'option1',
      value: 'option1',
      label: 'Option 1',
    },
    {
      id: 'option2',
      value: 'option2',
      label: 'Option 2',
    },
    {
      id: 'option3',
      value: 'option3',
      label: 'Option 3',
    }
  ];
}
