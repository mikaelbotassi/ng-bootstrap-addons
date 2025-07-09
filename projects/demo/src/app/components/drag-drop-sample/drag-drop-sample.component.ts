import { Component } from '@angular/core';
import { DragDropUploadComponent } from 'drag-drop-upload/drag-drop-upload.component';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';

@Component({
  selector: 'app-drag-drop-sample',
  imports: [DragDropUploadComponent, SampleContainerComponent],
  templateUrl: './drag-drop-sample.component.html',
})
export class DragDropSampleComponent {

}
