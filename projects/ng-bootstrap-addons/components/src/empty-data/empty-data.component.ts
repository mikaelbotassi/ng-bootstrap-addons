import { Component } from '@angular/core';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
    selector: 'nba-empty-data',
    imports: [],
    templateUrl: './empty-data.component.html',
    styleUrl: './empty-data.component.scss',
    host: { 'collision-id': `ac-search-sample-${createRandomString(20)} ` },
})
export class EmptyDataComponent {

}
