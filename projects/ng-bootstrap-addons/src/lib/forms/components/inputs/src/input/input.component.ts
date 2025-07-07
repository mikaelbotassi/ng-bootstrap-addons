import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrencyDirective } from '../../../../directives/src/currency.directive';
import { InputPasswordDirective } from '../../../../directives/src/input-password.directive';
import { ControlValueAccessorDirective } from '../../../../directives/src/control-value-acessor.directive';
import { FormErrorMessageComponent } from '../../../form-error-message/src/form-error-message.component';

type InputType = 'text' | 'number' | 'email' | 'password' | 'date';

@Component({
  selector: 'nba-input',
  templateUrl: './input.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormErrorMessageComponent, InputPlaceholderComponent, NgxMaskDirective, CurrencyDirective, InputPasswordDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  password = input(false, {transform: booleanAttribute});
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