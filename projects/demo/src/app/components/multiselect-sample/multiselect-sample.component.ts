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
  options:MultiselectOption[] = [
    new MultiselectOption({
      label: 'OptionOptionOptionOptionOptionOptionOptionOptionOptionOptionOption 1',
      value: {id: 1, name: 'Option 1'},
    }),
    new MultiselectOption({
      label: 'OptionOptionOptionOptionOptionOptionOptionOptionOptionOptionOption 2',
      value: {id: 2, name: 'Option 2'},
    }),
    new MultiselectOption({
      label: 'OptionOptionOptionOptionOptionOptionOptionOptionOptionOptionOption 3',
      value: {id: 3, name: 'Option 3'},
    }),
  ];
}
