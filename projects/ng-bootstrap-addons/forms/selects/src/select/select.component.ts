import { Component, forwardRef} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputPlaceholderComponent } from '../../../inputs/src/input-placeholder/input-placeholder.component';
import { ControlValueAccessorDirective } from '../../../../directives/src/control-value-acessor.directive';
import { FormErrorMessageComponent } from '../../../form-error-message/src/form-error-message.component';

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
})
export class SelectComponent<T> extends ControlValueAccessorDirective<T> {

}
