import { Component } from '@angular/core';
import { DragDropSampleComponent } from './components/drag-drop-sample/drag-drop-sample.component';
import { ErrorMessageSampleComponent } from './components/error-message-sample/error-message-sample.component';
import { EmptyDataSampleComponent } from './components/empty-data-sample/empty-data-sample.component';

@Component({
  selector: 'app-root',
  imports: [DragDropSampleComponent, ErrorMessageSampleComponent, EmptyDataSampleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
