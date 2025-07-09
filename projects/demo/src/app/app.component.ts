import { Component } from '@angular/core';
import { DragDropUploadComponent } from 'drag-drop-upload/drag-drop-upload.component';

@Component({
  selector: 'app-root',
  imports: [DragDropUploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';
}
