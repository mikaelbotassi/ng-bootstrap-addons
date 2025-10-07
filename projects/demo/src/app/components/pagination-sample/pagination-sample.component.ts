import { Component } from '@angular/core';
import { PaginationComponent } from 'project/pagination/src/pagination.component';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';

@Component({
  selector: 'app-pagination-sample',
  imports: [PaginationComponent, SampleContainerComponent],
  templateUrl: './pagination-sample.component.html',
})
export class PaginationSampleComponent {

}
