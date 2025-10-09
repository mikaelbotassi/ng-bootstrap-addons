import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationDirective } from 'ng-bootstrap-addons/directives';
import { DynamicSizeInputComponent } from 'ng-bootstrap-addons/inputs';

@Component({
  selector: 'nba-pagination',
  imports: [FormsModule, CommonModule, DynamicSizeInputComponent],
  styleUrl: './pagination.component.scss',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent<T=any> extends PaginationDirective<T> {}
