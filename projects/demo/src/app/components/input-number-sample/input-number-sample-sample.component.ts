import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { InputNumberComponent } from 'project/inputs/src/input-number/input-number.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-number-sample',
  imports: [InputNumberComponent, SampleContainerComponent, FormsModule],
  templateUrl: './input-number-sample.component.html',
})
export class InputNumberSampleComponent {
  value = 0;
}
