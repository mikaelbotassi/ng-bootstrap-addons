import { Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { TextAreaComponent } from 'textarea/textarea.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-textarea-sample',
  imports: [SampleContainerComponent, TextAreaComponent, ReactiveFormsModule],
  templateUrl: './textarea-sample.component.html',
})
export class TextareaSampleComponent {
  control = new FormControl<string>('', {validators: [Validators.required]});
}
