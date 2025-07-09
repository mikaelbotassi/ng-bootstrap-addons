import { Component } from '@angular/core';
import { EmptyDataComponent } from 'components/empty-data/empty-data.component';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';

@Component({
  selector: 'app-empty-data-sample',
  imports: [EmptyDataComponent, SampleContainerComponent],
  templateUrl: './empty-data-sample.component.html',
})
export class EmptyDataSampleComponent {

}
