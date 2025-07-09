import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { LabelComponent } from 'ng-bootstrap-addons/label';

@Component({
  selector: 'app-label-sample',
  imports: [SampleContainerComponent, LabelComponent],
  templateUrl: './label-sample.component.html',
})
export class LabelSampleComponent {

}
