import { Component, forwardRef} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputPlaceholderComponent } from 'ng-bootstrap-addons/inputs';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';

@Component({
  selector: 'nba-select',
  imports: [FormsModule, FormErrorMessageComponent, InputPlaceholderComponent, ReactiveFormsModule],
  templateUrl: 'select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  host: {
    'data-component': 'select'
  }
})
export class SelectComponent<T> extends ControlValueAccessorDirective<T> {

}
