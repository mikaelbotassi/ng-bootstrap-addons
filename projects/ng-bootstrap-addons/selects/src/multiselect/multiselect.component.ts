import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, DestroyRef, forwardRef, inject, input, signal, viewChild } from '@angular/core';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MultiselectOptionComponent } from './multiselect-option/multiselect-option.component';
import { distinctUntilChanged, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { InputPlaceholderComponent } from 'ng-bootstrap-addons/inputs';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { createRandomString } from 'ng-bootstrap-addons/utils';

@Component({
    selector: 'nba-multiselect',
    templateUrl: './multiselect.component.html',
    imports: [CommonModule, BsDropdownModule, FormsModule, MultiselectOptionComponent, FormErrorMessageComponent, InputPlaceholderComponent, ReactiveFormsModule],
    styleUrls: ['./multiselect.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MultiselectComponent),
        multi: true,
      },
      BsDropdownDirective
    ],
    host: { 'collision-id': `multiselect-${createRandomString(20)} ` },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiselectComponent<T extends Object> extends ControlValueAccessorDirective<T[]|null> {
  
  selectAllId = createRandomString(6);
  options = input<MultiselectOption<T>[]>([]);
  filteredOptions = computed(() => {
    const options = this.options();
    const searchText = this.searchText();
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    )
  });
  dropdown = viewChild<BsDropdownDirective>(BsDropdownDirective);
  descControl: FormControl<string | null> = new FormControl<string | null>(null);
  private destroyRef = inject(DestroyRef);
  searchText = signal<string>('');
  areAllSelected = signal<boolean>(false)
  multiple = input(true, { transform: booleanAttribute });

  override ngOnInit(): void {

    super.ngOnInit();

    this.control?.valueChanges.pipe(
      startWith(this.control?.value),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((value) => {
      if(!value || value.length === 0) {
        this.descControl.setValue('Selecione');
        this.areAllSelected.set(false);
        return;
      }

      const labels = this.options().filter(
        (option) => value?.includes(option.value)
      ).map((option) => option.label);

      this.descControl.setValue(labels.join(', '));

      this.areAllSelected.set(this.options().length === value.length);

    });

    this.control?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {

        if (this.control?.dirty && !this.descControl.dirty) {
          this.descControl?.markAsDirty();
        }

        if (this.control?.touched && this.descControl.untouched) {
          this.descControl?.markAsUntouched();
        }

        if (this.control?.invalid && this.descControl.valid) {
          this.descControl?.setErrors(this.control.errors);
        }

        if (this.control?.valid && this.descControl.invalid) {
          this.descControl?.setErrors(null);
        }

        if(this.control?.disabled) {
          this.descControl.disable({ emitEvent: false });
        }
        
    });
  }

  toggleSelection(option: MultiselectOption<T>) {
    const isSelected = this.control?.value?.includes(option.value) ?? false;
    
    if(!this.multiple()){
      this.propagateValue([option.value]);
      this.dropdown()?.hide();
      return;
    }

    this.propagateValue(isSelected
      ? this.control?.value?.filter((value:T) => value !== option.value) ?? null
      : [...this.control?.value ?? [], option.value]);
  }

  toggleAll() {
    if (this.areAllSelected()) {
      this.propagateValue([]);
    }
    else {
      this.propagateValue(this.options().map((option) => option.value));
    }
  }

  isSelected(option: MultiselectOption<T>): boolean {
    return this.control?.value?.includes(option.value) ?? false;
  }

}

export class MultiselectOption<T=any> {
  value: T;
  label: string;

  constructor(data: { value: T; label: string }) {
    this.value = data.value;
    this.label = data.label;
  }

  get id() {
    if(typeof this.value == 'object'){
      return `option-${JSON.stringify(this.value)}`;
    }
    return `option-${this.value}`;
  }

}
