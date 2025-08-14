import { ChangeDetectionStrategy, Component, forwardRef, input} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputPlaceholderComponent } from 'ng-bootstrap-addons/inputs';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-select',
  imports: [FormsModule, FormErrorMessageComponent, InputPlaceholderComponent, ReactiveFormsModule],
  templateUrl: 'select.component.html',
  host: { 'collision-id': `select-${createRandomString(20)} ` },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T> extends ControlValueAccessorDirective<T> {

  compareWith = input<(o1: any, o2: any) => boolean>((o1: any, o2: any) => {
    return o1 === o2;
  });

}
