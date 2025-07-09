import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'nba-textarea-placeholder',
  imports: [CommonModule],
  templateUrl: './textarea-placeholder.component.html',
  host: {
    'data-component': 'textarea-placeholder'
  }
})
export class TextareaPlaceholderComponent {

  rows = input<number>();
  height = computed(() => this.rows() ? `${this.rows()! * 1.2}em` : 'auto');

}
