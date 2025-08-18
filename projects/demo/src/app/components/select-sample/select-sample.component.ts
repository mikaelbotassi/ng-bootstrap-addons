import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { SelectComponent } from 'selects/select/select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-sample',
  imports: [SampleContainerComponent, SelectComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './select-sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSampleComponent {
  control = '';
}
