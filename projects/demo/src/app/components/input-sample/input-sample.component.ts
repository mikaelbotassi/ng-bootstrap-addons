import { Component, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { InputComponent } from 'inputs/input/input.component'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-sample',
  imports: [SampleContainerComponent, InputComponent, FormsModule],
  templateUrl: './input-sample.component.html',
})
export class InputSampleComponent {
  defaultInput = signal<string>('fggfg');
  currencyInput = signal<number>(135545);
  
  // Valores para teste
  testCurrency = 135545;
}
