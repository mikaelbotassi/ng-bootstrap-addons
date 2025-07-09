import { Component, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { SwitchComponent } from 'inputs/switch/switch.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch-sample',
  imports: [SampleContainerComponent, SwitchComponent, FormsModule],
  templateUrl: './switch-sample.component.html',
})
export class SwitchSampleComponent {
  value = signal<boolean>(false);
}
