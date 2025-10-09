import { NgModule } from '@angular/core';
import {
  AutoCompleteLovComponent,
  DateRangePickerComponent,
  InputComponent,
  DynamicSizeInputComponent,
  InputPlaceholderComponent,
  NumericIntervalInputComponent,
  SwitchComponent

} from '../public_api';

const components = [
  AutoCompleteLovComponent,
  DateRangePickerComponent,
  InputComponent,
  DynamicSizeInputComponent,
  InputPlaceholderComponent,
  NumericIntervalInputComponent,
  SwitchComponent
];

@NgModule({
  imports: components,
  exports: components
})
export class InputModule { }
