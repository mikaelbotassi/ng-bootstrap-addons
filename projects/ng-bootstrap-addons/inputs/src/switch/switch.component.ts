import { Component, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { createRandomString } from 'ng-bootstrap-addons/utils';

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
  host: { 'collision-id': `ac-search-sample-${createRandomString(20)} ` },
})
export class SwitchComponent<T> extends ControlValueAccessorDirective<T> {
}
