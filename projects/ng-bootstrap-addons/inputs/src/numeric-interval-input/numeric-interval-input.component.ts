import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  inject,
  Injector,
  OnInit,
  DestroyRef,
} from '@angular/core';
import {
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { createRandomString } from 'ng-bootstrap-addons/utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'nba-numeric-interval-input',
  imports: [
    CommonModule,
    InputPlaceholderComponent,
    FormErrorMessageComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './numeric-interval-input.component.html',
  styleUrl: './numeric-interval-input.component.scss',
  host: { 'collision-id': `numeric-interval-input-${createRandomString(20)}` },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericIntervalInputComponent),
      multi: true,
    },
    {
    provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumericIntervalInputComponent),
      multi: true,
    },
  ],
})
export class NumericIntervalInputComponent
  extends ControlValueAccessorDirective<(number | null)[] | number[] | null>
  implements OnInit, Validator
{
  initialValue = new FormControl<number | null>(null);
  endValue = new FormControl<number | null>(null);

  destroyRef = inject(DestroyRef);

  validate(control: FormControl): ValidationErrors | null {
    const value = control.value;

    if (control.hasValidator(Validators.required)) {
      if (!Array.isArray(value) || value.length !== 2 || value[0] == null || value[1] == null) {
        return { required: true };
      }
    }

    return null;
  }

  private onValidatorChange = () => {};

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  handleBlur() {
    if (this.control) {
      this.control.markAsTouched();
      this.control.updateValueAndValidity(); // <- ESSENCIAL
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.initialValue.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.control) {
          if(!this.initialValue && !this.endValue){
            this.control.setValue(null);
            this.control.updateValueAndValidity();
          }
          this.control.setValue([this.initialValue.value, this.endValue.value], { emitEvent: false });
          this.onValidatorChange();
        }
      });

    this.endValue.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.control) {
          if(!this.initialValue && !this.endValue){
            this.control.setValue(null);
            this.control.updateValueAndValidity();
          }
          this.control.setValue([this.initialValue.value, this.endValue.value], { emitEvent: false });
          this.onValidatorChange();
        }
    });


    // Externo → Interno (valor)
    this.control?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (Array.isArray(value) && value.length === 2) {
          this.initialValue.setValue(value[0], { emitEvent: false });
          this.endValue.setValue(value[1], { emitEvent: false });
        }else{
          this.initialValue.setValue(null, { emitEvent: false });
          this.endValue.setValue(null, { emitEvent: false });
        }
        this.syncStatus(this.control!, this.initialValue);
        this.syncStatus(this.control!, this.endValue);
      });

    // Externo → Interno (status)
    this.control?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.syncStatus(this.control!, this.initialValue);
        this.syncStatus(this.control!, this.endValue);
      });

    // Interno → Externo (status)
    this.initialValue.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.syncStatus(this.initialValue, this.control!);
      });

    this.endValue.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.syncStatus(this.endValue, this.control!);
      });

    // Inicial
    this.syncStatus(this.control!, this.initialValue);
    this.syncStatus(this.control!, this.endValue);
  }

  private syncStatus(from: FormControl, to: FormControl) {
    if (!from || !to || from === to) return;

    if (from.dirty && !to.dirty) to.markAsDirty();
    if (from.touched && !to.touched) to.markAsTouched();
    if (from.untouched && to.touched) to.markAsUntouched();
    if (from.pristine && !to.pristine) to.markAsPristine();

    if (from.invalid && to.valid) to.setErrors(from.errors);
    if (from.valid && to.invalid) to.setErrors(null);

    if (from.disabled && to.enabled) to.disable({ emitEvent: false });
    if (from.enabled && to.disabled) to.enable({ emitEvent: false });
  }
}
