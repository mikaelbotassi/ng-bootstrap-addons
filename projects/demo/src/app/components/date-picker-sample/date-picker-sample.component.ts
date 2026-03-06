import { Component, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from 'project/inputs/src/date-picker/date-picker.component';

@Component({
  selector: 'app-date-picker-sample',
  imports: [SampleContainerComponent, DatePickerComponent, FormsModule],
  templateUrl: './date-picker-sample.component.html',
})
export class DatePickerSampleComponent {

  date = signal<Date|undefined>(new Date());

  onValueChange(newValue:any){
    console.log('Date range changed:', newValue);
  }

}
