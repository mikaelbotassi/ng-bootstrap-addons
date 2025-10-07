import { Component, forwardRef, input, numberAttribute } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { createRandomString, isset } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-input-number',
  imports: [ReactiveFormsModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
  host: { 'collision-id': `input-number-${createRandomString(20)} ` },
})
export class InputNumberComponent extends ControlValueAccessorDirective<number> {

  min = input(-9999999, {transform: numberAttribute});
  max = input(9999999, {transform: numberAttribute});

  increase(){
    if(this.control){
      if(!isset(this.control.value)) return this.control.setValue(0);
      this.control.setValue(this.control.value + 1);
    }
  }

  decrease(){
    if(this.control){
      if(!isset(this.control.value)) return this.control.setValue(0);
      this.control.setValue(this.control.value - 1);
    }
  }

}
