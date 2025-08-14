import { Component } from '@angular/core';
import { DragDropSampleComponent } from './components/drag-drop-sample/drag-drop-sample.component';
import { ErrorMessageSampleComponent } from './components/error-message-sample/error-message-sample.component';
import { EmptyDataSampleComponent } from './components/empty-data-sample/empty-data-sample.component';
import { AcSearchSampleComponent } from './components/ac-search-sample/ac-search-sample.component';
import { AutocompleteService } from 'ng-bootstrap-addons/inputs';
import { DateRangePickerSampleComponent } from './components/date-range-picker-sample/date-range-picker-sample.component';
import { InputSampleComponent } from './components/input-sample/input-sample.component';
import { SwitchSampleComponent } from './components/switch-sample/switch-sample.component';
import { SelectSampleComponent } from './components/select-sample/select-sample.component';
import { MultiselectSampleComponent } from './components/multiselect-sample/multiselect-sample.component';
import { TextareaSampleComponent } from './components/textarea-sample/textarea-sample.component';
import { LabelSampleComponent } from './components/label-sample/label-sample.component';
import { TableSampleComponent } from './components/table-sample/table-sample.component';
import { NumericIntervalInputSampleComponent } from "./components/numeric-interval-input-sample/numeric-interval-input-sample.component";

@Component({
  selector: 'app-root',
  providers: [AutocompleteService],
  imports: [
    DragDropSampleComponent,
    ErrorMessageSampleComponent,
    EmptyDataSampleComponent,
    AcSearchSampleComponent,
    DateRangePickerSampleComponent,
    InputSampleComponent,
    SwitchSampleComponent,
    SelectSampleComponent,
    MultiselectSampleComponent,
    TextareaSampleComponent,
    LabelSampleComponent,
    TableSampleComponent,
    NumericIntervalInputSampleComponent
],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'demo';
}
