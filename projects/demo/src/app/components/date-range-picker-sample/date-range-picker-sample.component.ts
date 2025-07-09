import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { DatetimeRangePickerComponent } from 'inputs/datetime-range-picker/datetime-range-picker.component';

@Component({
  selector: 'app-date-range-picker-sample',
  imports: [SampleContainerComponent, DatetimeRangePickerComponent],
  templateUrl: './date-range-picker-sample.component.html',
})
export class DateRangePickerSampleComponent {

}
