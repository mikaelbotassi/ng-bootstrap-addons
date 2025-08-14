import { booleanAttribute, Directive, ElementRef, Inject, Injector, input, model, OnInit, viewChild } from '@angular/core';
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
import { Subject, takeUntil, startWith, distinctUntilChanged } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
})
export class ControlValueAccessorDirective<T> implements ControlValueAccessor, OnInit{

    inputRef = viewChild<ElementRef<T>>('input');
    inputClass = input<string>('');
    class = input<string>('');
    inputId = model<string>(createRandomString(6));
    label = input<string>();
    icon = input<string>();
    size = input<'xs' | 'sm' | 'md' | 'lg'>('md');

    control: FormControl | undefined;
    isRequired = false;
    required = input(false, { transform: booleanAttribute });

    private _isDisabled = false;
    private _destroy$ = new Subject<void>();
    private _onTouched!: () => T;

    constructor(@Inject(Injector) private injector: Injector) {}

    ngOnInit() {
        this.setFormControl();
        if (this.required() && this.control && !this.control.hasValidator(Validators.required)) {
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
                    this.control = (formControl as FormControlDirective).form as FormControl;
                    break;
            }
        } catch (err) {
            this.control = new FormControl();
        }
    }

    writeValue(value: T): void {
        if (this.control) {
          if (this.control.value !== value) {
            this.control.setValue(value, { emitEvent: false });
          }
        } else {
          this.control = new FormControl(value);
        }
    }      

    registerOnChange(fn: (val: T | null) => void): void {
        this.control?.valueChanges
        .pipe(
            takeUntil(this._destroy$),
            startWith(this.control.value),
            distinctUntilChanged()
        )
        .subscribe((val) => {
            fn(val);
            this.control?.markAsUntouched();
        });
    }

    registerOnTouched(fn: () => T): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }
}