import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sample-container',
  imports: [],
  templateUrl: './sample-container.component.html',
})
export class SampleContainerComponent {
  tagName = input.required<string>();
}
