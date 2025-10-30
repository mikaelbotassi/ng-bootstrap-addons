import { Component, OnInit, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { AutoCompleteLovComponent } from 'inputs/ac-search-lov/ac-search-lov.component';
import { AcMap } from 'inputs//ac-search-lov/models/ac-models';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment.development';

@Component({
  selector: 'app-ac-search-sample',
  imports: [SampleContainerComponent, AutoCompleteLovComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './ac-search-sample.component.html',
})
export class AcSearchSampleComponent {

  environment = environment;

  mapConfig: AcMap = {
    code: { key: 'imdbID', title: 'IMDB ID' },
    desc: { key: 'Title', title: 'Title' },
    addons: [{ key: 'Year', title: 'Year' }],
  }
  selectedMovie = 'tt2015381';

  count = 0;
  incrementCount() {
    this.count++;
  }

  onModelChange(value: any) {
    console.log('Model changed:', value);
  }

  onPerformed(event:any){
    console.log('Search performed:', event);
  }

}
