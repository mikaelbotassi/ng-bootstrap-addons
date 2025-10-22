import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationDirective } from 'ng-bootstrap-addons/directives';
import { DynamicSizeInputComponent } from 'ng-bootstrap-addons/inputs';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
  selector: 'nba-pagination',
  imports: [FormsModule, CommonModule, DynamicSizeInputComponent],
  styleUrl: './pagination.component.scss',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'collision-id': `drag-drop-upload-${createRandomString(20)} ` },

})
export class PaginationComponent<T=any> extends PaginationDirective<T> {}
