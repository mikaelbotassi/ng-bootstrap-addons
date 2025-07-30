import { Component, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';

@Component({
  selector: 'nba-switch',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './switch.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent<T> extends ControlValueAccessorDirective<T> {
}
