import { Component, inject } from '@angular/core';
import { DragDropSampleComponent } from '../../components/drag-drop-sample/drag-drop-sample.component';
import { ErrorMessageSampleComponent } from '../../components/error-message-sample/error-message-sample.component';
import { EmptyDataSampleComponent } from '../../components/empty-data-sample/empty-data-sample.component';
import { AcSearchSampleComponent } from '../../components/ac-search-sample/ac-search-sample.component';
import { DateRangePickerSampleComponent } from '../../components/date-range-picker-sample/date-range-picker-sample.component';
import { InputSampleComponent } from '../../components/input-sample/input-sample.component';
import { SwitchSampleComponent } from '../../components/switch-sample/switch-sample.component';
import { SelectSampleComponent } from '../../components/select-sample/select-sample.component';
import { MultiselectSampleComponent } from '../../components/multiselect-sample/multiselect-sample.component';
import { TextareaSampleComponent } from '../../components/textarea-sample/textarea-sample.component';
import { LabelSampleComponent } from '../../components/label-sample/label-sample.component';
import { TableSampleComponent } from '../../components/table-sample/table-sample.component';
import { NumericIntervalInputSampleComponent } from '../../components/numeric-interval-input-sample/numeric-interval-input-sample.component';
import { ComponentNavigationService } from 'project/services/src/component-navigation.service';
import { CustomerCardListComponent } from '../form-page/components/customer-card-list/customer-card-list.component';
import { PaginationSampleComponent } from '../../components/pagination-sample/pagination-sample.component';
import { DynamicSizeInputSampleComponent } from '../../components/dynamic-size-input-sample/dynamic-size-input-sample.component';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
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
    NumericIntervalInputSampleComponent,
    PaginationSampleComponent,
    DynamicSizeInputSampleComponent
  ],
})
export class SamplesComponent {

  private navigationService = inject(ComponentNavigationService);

  openList() {
    this.navigationService.go<{name:string}>(CustomerCardListComponent, {name: 'Customer List'});
  }

}
