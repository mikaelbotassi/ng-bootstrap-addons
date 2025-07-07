import { Component, forwardRef} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormErrorMessageComponent } from '../../form-error-message/form-error-message.component';
import { InputPlaceholderComponent } from '../../inputs/input-placeholder/input-placeholder.component';
import { ControlValueAccessorDirective } from '../../../directives/control-value-acessor.directive';

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
