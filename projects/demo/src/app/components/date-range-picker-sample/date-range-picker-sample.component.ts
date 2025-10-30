import { Component, effect, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { FormsModule } from '@angular/forms';
import { DateRangePickerComponent } from 'project/inputs/src/date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-date-range-picker-sample',
  imports: [SampleContainerComponent, DateRangePickerComponent, FormsModule],
  templateUrl: './date-range-picker-sample.component.html',
})
export class DateRangePickerSampleComponent {

  dateRange = signal<(Date|undefined)[]|undefined>([new Date(), new Date()]);

}
