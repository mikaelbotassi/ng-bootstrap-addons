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
  cdMovie:string|null = 'tt2015381';
  
  clearMovie(){
    this.cdMovie = null;
  }

}

type Movie = {
  cdMovie:string|null;
}
