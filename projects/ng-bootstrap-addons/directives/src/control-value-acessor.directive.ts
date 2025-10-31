import {
  booleanAttribute,
  Directive,
  ElementRef,
  Inject,
  Injector,
  input,
  model,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  Validators,
  NgControl,
  FormControlName,
  FormGroupDirective,
  FormControlDirective,
  NgModel,
} from '@angular/forms';
import { createRandomString } from 'ng-bootstrap-addons/utils';
import {
  Subject,
} from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
})
export class ControlValueAccessorDirective<T>
  implements ControlValueAccessor, OnInit
{
  inputRef = viewChild<ElementRef<HTMLElement>>('input');
  inputClass = input<string>('');
  labelClass = input<string>('');
  formGroupClass = input<string>('');
  inputId = model<string>(createRandomString(6));
  label = input<string>();
  icon = input<string>();
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
  controlSignal = signal<FormControl|undefined>(undefined);

  control: FormControl | undefined;
  isRequired = false;
  required = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });

  private _isDisabled = false;
  protected _destroy$ = new Subject<void>();
  protected _onChange: (val: T | null) => void = () => {};
  protected _onTouched: () => void = () => {};

  constructor(@Inject(Injector) private injector: Injector) {}

  ngOnInit() {
    this.setFormControl();
    if (
      this.required() &&
      this.control &&
      !this.control.hasValidator(Validators.required)
    ) {
      this.control.addValidators(Validators.required);
      this.control.updateValueAndValidity({ emitEvent: false });
    }

    this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
  }

  setFormControl() {
    try {
      const formControl = this.injector.get(NgControl);
      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        case NgModel:
          this.control = formControl.control as FormControl;
          break;
        default:
          this.control = (formControl as FormControlDirective)
            .form as FormControl;
          break;
      }
      this.controlSignal.set(this.control);
    } catch (err) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    if (this.control) {
      if (this.control.value !== value) {
        this.control.setValue(value, { emitEvent: false });
      }
      return;
    }
    this.control = new FormControl(value);
    this.controlSignal.set(this.control);
  }

  registerOnChange(fn: (val: T | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => T): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  protected propagateValue(value: T | null): void {
    this._onChange(value);
    if (this.control && this.control.value !== value) {
      this.control.setValue(value as any, { emitEvent: false });
    }
  }

  protected markTouched(): void {
    this._onTouched();
    this.control?.markAsTouched();
  }

}
