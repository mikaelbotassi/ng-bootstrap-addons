import { booleanAttribute, Component, forwardRef, input, numberAttribute } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { createRandomString, isset } from 'ng-bootstrap-addons/utils';
import { InputType } from '../models/input-models';

@Component({
  selector: 'nba-dynamic-size-input',
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-size-input.component.html',
  styleUrl: './dynamic-size-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicSizeInputComponent),
      multi: true,
    },
  ],
  host: { 'collision-id': `dynamic-size-input-${createRandomString(20)} ` },
})
export class DynamicSizeInputComponent extends ControlValueAccessorDirective<number> {

  type = input<InputType>('text');
  ///NgxMask
  mask = input<string>();
  validation = input(true);
  dropSpecialCharacters = input(true, {transform: booleanAttribute});

  currency = input(false, {transform: booleanAttribute});   
  hasCurrency = input(false, {transform: booleanAttribute});
  decimalPlaces = input(2);
  customErrorMessages = input<Record<string, string>>({});

  //Browser default
  autocomplete = input<string | boolean>(false);

}