import { Component } from '@angular/core';
import { DragDropSampleComponent } from './components/drag-drop-sample/drag-drop-sample.component';
import { ErrorMessageSampleComponent } from './components/error-message-sample/error-message-sample.component';
import { EmptyDataSampleComponent } from './components/empty-data-sample/empty-data-sample.component';
import { AcSearchSampleComponent } from './components/ac-search-sample/ac-search-sample.component';
import { AutocompleteService } from 'ng-bootstrap-addons/inputs';
import { DateRangePickerSampleComponent } from './components/date-range-picker-sample/date-range-picker-sample.component';
import { InputSampleComponent } from './components/input-sample/input-sample.component';

@Component({
  selector: 'app-root',
  providers: [AutocompleteService],
  imports: [
    DragDropSampleComponent, 
    ErrorMessageSampleComponent, 
    EmptyDataSampleComponent, 
    AcSearchSampleComponent,
    DateRangePickerSampleComponent,
    InputSampleComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
