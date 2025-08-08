import { Component, contentChild, input, OnInit, signal } from '@angular/core';
import { DatetimeRangePickerComponent, InputComponent, SwitchComponent } from 'ng-bootstrap-addons/inputs';
import { ColumnFilterType } from '../models/table-models';

@Component({
  selector: 'nba-column-filter-form',
  imports: [InputComponent, DatetimeRangePickerComponent, SwitchComponent],
  templateUrl: './column-filter-form.component.html',
})
export class ColumnFilterFormComponent {
  template = contentChild('filter');
  type = input.required<ColumnFilterType>();
  value = signal<any>(null);

}