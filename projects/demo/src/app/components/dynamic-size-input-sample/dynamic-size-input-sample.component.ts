import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { FormsModule } from '@angular/forms';
import { DynamicSizeInputComponent } from 'project/inputs/src/dynamic-size-input/dynamic-size-input.component';

@Component({
  selector: 'app-dynamic-size-input-sample',
  imports: [DynamicSizeInputComponent, SampleContainerComponent, FormsModule],
  templateUrl: './dynamic-size-input-sample.component.html',
})
export class DynamicSizeInputSampleComponent {
  value = 0;
}
