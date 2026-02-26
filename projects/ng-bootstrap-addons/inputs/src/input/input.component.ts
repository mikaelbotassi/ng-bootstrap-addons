import { CommonModule } from '@angular/common';
import { Component, booleanAttribute, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrencyDirective } from 'ng-bootstrap-addons/directives';
import { InputPasswordDirective } from 'ng-bootstrap-addons/directives';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { createRandomString } from 'ng-bootstrap-addons/utils';
import { InputType } from '../models/input-models';
import { distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'nba-input',
  templateUrl: './input.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormErrorMessageComponent, InputPlaceholderComponent, NgxMaskDirective, CurrencyDirective, InputPasswordDirective],
  host: { 'collision-id': `input-sample-${createRandomString(20)} ` },
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

  private readonly _datalistId = createRandomString(10);
  datalist=input<SelectOption[]>([]);
  datalistId = computed(() => this.datalist()?.length ? this._datalistId : null);
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

  override ngOnInit(): void {
    super.ngOnInit();
    this.control?.valueChanges
    .pipe(
      takeUntil(this._destroy$),
      distinctUntilChanged()
    )
    .subscribe((value) => {
      this.propagateValue(value);
    });
  }


}

export class SelectOption<T=any> {
  value: T;
  label: string;

  constructor(data: { value: T; label: string }) {
    this.value = data.value;
    this.label = data.label;
  }

  get id() {
    if(typeof this.value == 'object'){
      return `option-${JSON.stringify(this.value)}`;
    }
    return `option-${this.value}`;
  }

}