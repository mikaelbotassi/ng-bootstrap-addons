import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextareaPlaceholderComponent } from './placeholder/textarea-placeholder.component';
import { ControlValueAccessorDirective } from '../../../directives/src/control-value-acessor.directive';
import { FormErrorMessageComponent } from '../../form-error-message/src/form-error-message.component';

@Component({
  selector: 'nba-textarea',
  imports: [CommonModule, ReactiveFormsModule, FormErrorMessageComponent, TextareaPlaceholderComponent],
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
})
export class TextAreaComponent<T> extends ControlValueAccessorDirective<T> {
  rows = input<number>(5);
  height = computed(() => this.rows() ? `${this.rows()! * 1.2}em` : 'auto');
}
