import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrencyDirective } from 'ng-bootstrap-addons/directives';
import { InputPasswordDirective } from 'ng-bootstrap-addons/directives';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';

type InputType = 'text' | 'number' | 'email' | 'password' | 'date';

@Component({
  selector: 'nba-input',
  templateUrl: './input.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormErrorMessageComponent, InputPlaceholderComponent, NgxMaskDirective, CurrencyDirective, InputPasswordDirective],
  styleUrl: './input.component.scss',
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