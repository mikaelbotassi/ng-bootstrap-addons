import { NgModule } from '@angular/core';
import {
  AutoCompleteLovComponent,
  DateRangePickerComponent,
  InputComponent,
  InputNumberComponent,
  InputPlaceholderComponent,
  NumericIntervalInputComponent,
  SwitchComponent

} from '../public_api';

const components = [
  AutoCompleteLovComponent,
  DateRangePickerComponent,
  InputComponent,
  InputNumberComponent,
  InputPlaceholderComponent,
  NumericIntervalInputComponent,
  SwitchComponent
];

@NgModule({
  imports: components,
  exports: components
})
export class InputModule { }
