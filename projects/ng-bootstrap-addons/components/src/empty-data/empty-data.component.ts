import { Component } from '@angular/core';

@Component({
    selector: 'nba-empty-data',
    imports: [],
    templateUrl: './empty-data.component.html',
    styleUrl: './empty-data.component.scss',
    host: {
        'data-component': 'empty-data'
    }
})
export class EmptyDataComponent {

}
