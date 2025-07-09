import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { InputComponent } from 'inputs/input/input.component'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-sample',
  imports: [SampleContainerComponent, InputComponent, FormsModule],
  templateUrl: './input-sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSampleComponent {
  defaultInput = signal<string>('');
  currencyInput = signal<string>('');
  passwordInput = signal<string>('');
}
