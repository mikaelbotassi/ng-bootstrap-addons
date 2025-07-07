import { Component, input, output, inject, forwardRef, model, signal, computed, DestroyRef, Injector, effect } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormErrorMessageComponent } from '../../form-error-message/form-error-message.component';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { asyncScheduler, observeOn, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClickOutsideDirective, ControlValueAccessorDirective } from '../../../../../public-api';
import { AutoCompleteConfig, AutocompleteService } from './services/auto-complete.service';
import { Command1 } from '../../../../../utils/command';
import { AutocompleteCollapseComponent } from './components/ac-collapse/ac-collapse.component';

@Component({
  selector: 'nba-ac-lov',
  templateUrl: './ac-search-lov.component.html',
  styleUrls: ['./ac-search-lov.component.scss'],
  imports: [FormErrorMessageComponent, InputPlaceholderComponent, ReactiveFormsModule, ClickOutsideDirective, CollapseDirective, AutocompleteCollapseComponent, CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteLovComponent),
      multi: true,
    },
  ],
})
export class AutoCompleteLovComponent extends ControlValueAccessorDirective<string|number|null> {

  acUrl = input.required<string>();
  acParams = input<HttpParams>(new HttpParams());
  map = input.required<acMap>();
  focus = model<boolean>(false);
  private _listOfValues = signal<any[]>([]);
  listOfValues = computed(() => this._listOfValues());
  onPerformed = output<'autocomplete' | 'lov'>();
  descControl: FormControl<string | null> = new FormControl<string | null>(null);
  desc = model<string | null>(null);
  private destroyRef = inject(DestroyRef);
  fetchDescCommand!: Command1<any[], AutoCompleteConfig>;
  private acService = inject(AutocompleteService);

  constructor() {
    super(inject(Injector));

    effect(() => {
      const desc = this.desc();
      if (this.descControl.value !== desc) {
        this.descControl.setValue(desc, { emitEvent: false });
      }
    });    

    this.fetchDescCommand = new Command1<any[], AutoCompleteConfig>((configs) =>
      this.acService.performAutocomplete(configs).pipe(observeOn(asyncScheduler))
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.control?.value && this.control.value !== '' && this.descControl.value && this.descControl.value !== '') {
      this.setCompleteDesc();
      return;
    }
    if (this.control?.value && this.control.value !== '') {
      this.fetchDesc(this.control.value);
    }

    this.descControl.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((value) => {
      
      this.desc.set(value);
      if (!value || value.trim() === '') {
        this.controlValue = null;
        return;
      }

      if(this.focus()) return this.fetchLov(this.descControl.value!);
      return this.fetchDesc(this.descControl.value!);

    });

    this.control?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {

        if (this.control?.dirty && !this.descControl.dirty) {
          this.descControl.markAsDirty();
        }

        if (this.control?.touched) {
          this.descControl.markAsTouched({ onlySelf: true });
        }

        if(this.control?.untouched && this.descControl.touched) {
          this.descControl.markAsUntouched({ onlySelf: true });
        }

        if (this.control?.invalid && this.descControl.valid) {
          this.descControl.setErrors(this.control.errors);
        }

        if (this.control?.valid && this.descControl.invalid) {
          this.descControl?.setErrors(null);
        }
        if(this.control?.disabled) {
          this.descControl.disable({ emitEvent: false });
        }
      });
  }

  override writeValue(value: any): void {
    if (this.control && JSON.stringify(this.control.value) !== JSON.stringify(value)) {
      this.control.patchValue(value, { emitEvent: false });
    }
  }

  set controlValue(value:any){
    this.control?.setValue(value, { emitEvent: false });
    this.control?.markAsTouched();
    this.control?.markAsDirty();
    this.control?.updateValueAndValidity();
  }

  updateListOfValues(val: any[]) {
    this._listOfValues.set([...val]);
  }

  fetchLov(desc?: string | null) {
    const config: AutoCompleteConfig = {
      apiUrl: this.acUrl(),
      searchProperty: desc ?? undefined,
      params: this.acParams(),
      type: 'lov'
    };
    this.focus.set(true);
    this.executeCommand(config);
  }

  fetchDesc(code: string|number) {
    let params = this.acParams();
    params = params.append(this.map().code.key, code);
    const config: AutoCompleteConfig = {
      apiUrl: this.acUrl(),
      params: params,
      type: 'autocomplete',
    };
    this.executeCommand(config);
  }

  executeCommand(configs: AutoCompleteConfig) {
    this.fetchDescCommand.execute(configs);
    this.fetchDescCommand.result()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any[]) => {
          if (res.length === 0) {
            this.values = null;
            this.updateListOfValues([]);
            return;
          }
          if (res.length > 1) {
            this.updateListOfValues(res);
            this.focus.set(true);
            this.onPerformed.emit(configs.type);
            return;
          }
          this.values = res[0];
          this.updateListOfValues(res);
          this.onPerformed.emit(configs.type);
        },
        error: () => {
          this.values = null;
          this.onPerformed.emit(configs.type);
        }
      });
  }

  set values(value: any | null) {
    if (!value) {
      this.descControl.patchValue(null, { emitEvent: false });
      this.controlValue = null;
      this.map().addons?.forEach((addon) => {
        if (addon.setValue) addon.setValue(null);
      });
      return;
    }
    this.completeDescFromResponse = value;
    this.controlValue = value[this.map().code.key];
    this.map().addons?.forEach((addon) => {
      const newValue = value[addon.key];
      if (newValue && addon.setValue) addon.setValue(value);
    });
  }

  set completeDescFromResponse(value: any) {
    this.descControl.setValue(`${value[this.map().code.key]} - ${value[this.map().desc.key]}`, { emitEvent: false });
  }

  setCompleteDesc() {
    this.descControl.setValue(`${this.control?.value} - ${this.descControl.value}`, { emitEvent: false });
  }

  get completeDesc(): string {
    return `${this.control?.value} - ${this.descControl.value?.trimStart().trimEnd()}`;
  }

  selectItem(item: any) {
    this.values = item;
    this.focus.set(false);
  }
}

export type acMap = {
  code: acControl;
  desc: acControl;
  addons?: acControl[];
}

export type acControl = {
  key: string;
  setValue?: (value: any | null) => void;
  getValue?: () => any | null;
  title: string;
}
