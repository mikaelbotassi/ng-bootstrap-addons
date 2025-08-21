import { Component, input, output, inject, forwardRef, model, signal, computed, DestroyRef, Injector, effect, booleanAttribute, ChangeDetectionStrategy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { asyncScheduler, observeOn, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoCompleteConfig, AutocompleteService } from './services/auto-complete.service';
import { AutocompleteCollapseComponent } from './components/ac-collapse/ac-collapse.component';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { AutofocusDirective, ClickOutsideDirective } from 'ng-bootstrap-addons/directives';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { Command1, createRandomString } from 'ng-bootstrap-addons/utils';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';

@Component({
  selector: 'nba-ac-lov',
  templateUrl: './ac-search-lov.component.html',
  styleUrls: ['./ac-search-lov.component.scss'],
  imports: [FormErrorMessageComponent, InputPlaceholderComponent, ReactiveFormsModule, ClickOutsideDirective, CollapseDirective, AutocompleteCollapseComponent, CommonModule, FormsModule, AutofocusDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'collision-id': `ac-search-lov-${createRandomString(20)} ` },
  providers: [
    AutocompleteService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteLovComponent),
      multi: true,
    },
  ],
})
export class AutoCompleteLovComponent extends ControlValueAccessorDirective<string|number|null> {

  /**
   * The URL to use for the autocomplete requests.
   * You can put the ac input data customized like:
   * https://your-api-endpoint.com/autocomplete?id=:id
   */
  acUrl = input.required<string>();

  autofocus = input(false, {transform: booleanAttribute});
  searchName = input<string>('filtro');
  map = input.required<acMap>();
  focus = model<boolean>(false);
  private _listOfValues = signal<any[]>([]);
  listOfValues = computed(() => this._listOfValues());
  onPerformed = output<ActionPerformed>();
  descControl: FormControl<string | null> = new FormControl<string | null>(null);
  desc = model<string | null>(null);
  private destroyRef = inject(DestroyRef);
  fetchDescCommand!: Command1<any[], AutoCompleteConfig>;
  private acService = inject(AutocompleteService);
  readonly debounceTime = input<number>(1000);

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
      debounceTime(this.debounceTime()),
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

    this.control?.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((value:any) => {
      if (value && !this.descControl.value) {
        this.fetchDesc(value);
      }
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

        if(this.control?.disabled && !this.descControl.disabled) {
          this.descControl.disable({ emitEvent: false });
        }
        
        if(this.control?.enabled && this.descControl.disabled) {
          this.descControl.enable({ emitEvent: false });
        }

      });
  }

  override writeValue(value: any): void {
    if (this.control && JSON.stringify(this.control.value) !== JSON.stringify(value)) {
      this.control.patchValue(value, { emitEvent: false });
      if (value) {
        this.fetchDesc(value);
      }
    }
  }

  set controlValue(value:any){
    this.control?.setValue(value, { emitEvent: false });
    this.control?.markAsTouched();
    this.control?.markAsDirty();
    this.control?.updateValueAndValidity();
  }

  updateListOfValues(val: any[]) {
    if(!val[0] || !val[0][this.map().code.key] && !val[0][this.map().desc.key]){
      console.warn('Invalid value structure for autocomplete LOV');
      this._listOfValues.set([]);
      return;
    }
    this._listOfValues.set([...val]);
  }

  private buildApiCall(code?: string | number): { apiUrl: string, params: HttpParams } {
    const codeKey = this.map().code.key;
    let url = this.acUrl();
    let params = new HttpParams();

    const hasCode = !!code && code.toString().length;
    
    if (hasCode) url = url.replace(`:${codeKey}`, code.toString());
    
    const [baseUrl, queryString] = url.split('?');
    
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) =>
        params = params.append(key, value === `:${codeKey}` && hasCode ? code.toString() : value)
      );
    }
    
    if (hasCode && !url.includes(code.toString()) && !queryString?.includes(codeKey)) {
      params = params.append(codeKey, code.toString());
    }
    
    return { apiUrl: baseUrl, params };
  }

  fetchLov(desc?: string | null) {
    let { apiUrl, params } = this.buildApiCall();
    if (desc) params = params.append(this.searchName(), desc);
    const config: AutoCompleteConfig = {
      apiUrl: apiUrl,
      params: params,
      type: 'lov'
    };
    this.focus.set(true);
    this.executeCommand(config);
  }

  fetchDesc(code: string|number) {
    let { apiUrl, params } = this.buildApiCall();
    params = params.append(this.map().code.key, code);
    const config: AutoCompleteConfig = {
      apiUrl: apiUrl,
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
        next: (res: any) => {
          if(!Array.isArray(res)) {
            this.values = res;
            this.updateListOfValues([res]);
            this.onPerformed.emit({
              type: configs.type,
              data: res,
              status: Status.SUCCESS
            });
            return;
          }
          if (res.length === 0) {
            this.values = null;
            this.updateListOfValues([]);
            this.onPerformed.emit({
              type: configs.type,
              data: null,
              status: Status.EMPTY
            });
            return;
          }
          if (res.length > 1) {
            this.updateListOfValues(res);
            this.focus.set(true);
            return;
          }
          this.values = res[0];
          this.updateListOfValues(res);
          this.onPerformed.emit({
            type: configs.type,
            data: res[0],
            status: Status.SUCCESS
          });
        },
        error: () => {
          this.values = null;
          this.onPerformed.emit({
            type: configs.type,
            data: null,
            status: Status.FAIL
          });
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
    if(!value[this.map().code.key] && !value[this.map().desc.key]){
      this.descControl.setValue('');
      this.controlValue = null;
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
    this.onPerformed.emit({
      type: 'lov',
      data: item,
      status: Status.SUCCESS
    });
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

export type ActionPerformed = {
  type: 'autocomplete' | 'lov';
  data: any;
  status: Status.EMPTY | Status.FAIL | Status.SUCCESS;
}

export enum Status {
  FAIL = -1,
  EMPTY = 0,
  SUCCESS = 1
}