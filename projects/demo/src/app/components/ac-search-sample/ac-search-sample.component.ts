import { AfterContentChecked, AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { SampleContainerComponent } from '../../containers/sample-container/sample-container.component';
import { AutoCompleteLovComponent, acMap } from 'inputs/ac-search-lov/ac-search-lov.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ac-search-sample',
  imports: [SampleContainerComponent, AutoCompleteLovComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './ac-search-sample.component.html',
})
export class AcSearchSampleComponent implements OnInit {
  
  mapConfig: acMap = {
    code: { key: 'id', title: 'ID' },
    desc: { key: 'name', title: 'Name' }
  }
  selectedPokemon = signal<number|null>(null);

  ngOnInit(): void {
    this.selectedPokemon.set(5);
  }

}
