import {Directive, ElementRef, HostListener, booleanAttribute, forwardRef, input } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { NumericPipe } from 'ng-bootstrap-addons/pipes';

@Directive({
    selector: '[currency]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CurrencyDirective),
            multi: true
        },
        NumericPipe
    ],
})
export class CurrencyDirective implements ControlValueAccessor {
    private onChange = (value: number) => {};
    private onTouched = () => {};
    hasCurrency = input(false, {transform: booleanAttribute})
    decimalPlaces = input(2)
  
    private value = 0;
    private max = 1000000000000;
  
    constructor(private el: ElementRef<HTMLInputElement>, private numericPipe: NumericPipe) {}
  
    writeValue(value: number): void {
      this.value = value;
      if (value) {
        this.el.nativeElement.value = this.numericPipe.transform(value, this.hasCurrency(), this.decimalPlaces()) as string;
      }
    }
  
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
  
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
  
    setDisabledState(isDisabled: boolean): void {
      this.el.nativeElement.disabled = isDisabled;
    }
  
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
      const input = this.el.nativeElement;
  
      if (event.key === 'Backspace') {
        this.updateField(input.value.slice(0, -1));
      }
  
      if (event.key === 'Delete') {
        this.updateField('');
      }
  
      if (/^\d$/.test(event.key)) {
        this.updateField(input.value + event.key);
      }
  
      if (event.key !== 'Tab') {
        event.preventDefault();
      }
    }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }
  
  private updateField(str: string) {
    const raw = str.replace(/\D/g, '');
    const divisor = Math.pow(10, this.decimalPlaces());
  
    if (!raw) {
      this.value = 0;
      this.el.nativeElement.value = '';
      this.onChange(0);
      return;
    }
  
    const numeric = Number(raw) / divisor;
  
    this.value = numeric <= this.max ? numeric : this.value;
  
    this.el.nativeElement.value = this.numericPipe.transform(
      this.value,
      this.hasCurrency(),
      this.decimalPlaces()
    ) as string;
  
    this.onChange(this.value);
  }
  
}  