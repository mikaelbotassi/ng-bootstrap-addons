import { Component, input, output, inject, forwardRef, model, signal, computed, DestroyRef, Injector, effect, booleanAttribute, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';
import { asyncScheduler, observeOn, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutocompleteService } from './services/auto-complete.service';
import { AutocompleteCollapseComponent } from './components/ac-collapse/ac-collapse.component';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { ClickOutsideDirective } from 'ng-bootstrap-addons/directives';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { Command1, createRandomString } from 'ng-bootstrap-addons/utils';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { AcMap, ActionPerformed, AutoCompleteConfig, Status } from './models/ac-models';
import { AutofocusDirective } from 'project/directives/src/autofocus.directive';

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

  //INPUTS
  autofocus = input(false, {transform: booleanAttribute});
  searchName = input<string>('filtro');
  resultPath = input<{autocomplete?: string, lov?: string}>({autocomplete: '', lov: ''});
  readonly debounceTime = input<number>(1000);
  map = input.required<AcMap>();

  //MODELS
  focus = model<boolean>(false);
  desc = model<string | null>(null);

  //SIGNALS
  private _listOfValues = signal<any[]>([]);

  // COMPUTED PROPERTIES
  listOfValues = computed(() => this._listOfValues());

  //OUTPUTS
  onPerformed = output<ActionPerformed>();

  // CONTROLS
  descControl: FormControl<string | null> = new FormControl<string | null>(null);

  // INJECTORS
  private destroyRef = inject(DestroyRef);
  private acService = inject(AutocompleteService);

  // COMMANDS
  fetchDescCommand!: Command1<any[], AutoCompleteConfig>;

  constructor() {
    super(inject(Injector));

    effect(() => {
      const desc = this.desc();
      if (this.descControl.value !== desc && !this.descControl.dirty) {
        this.descControl.setValue(desc, { emitEvent: false });
      }
    });  

    this.fetchDescCommand = new Command1<any[], AutoCompleteConfig>((configs) =>
      this.acService.performAutocomplete(configs).pipe(observeOn(asyncScheduler))
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.control?.value && this.control.value !== '') {
      if (this.descControl.value && this.descControl.value !== '') {
        this.setCompleteDesc();
        return;
      }
      this.fetchDesc(this.control.value);
    }

    this.descControl.valueChanges
    .pipe(
      debounceTime(this.debounceTime()),
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
    if (this.control) {
      // this.control.patchValue(value, { emitEvent: false });
      if (value) {
        this.fetchDesc(value);
        return;
      }
      this.descControl.patchValue(null, { emitEvent: false });
      this.desc.set(null);
    }
  }

  set controlValue(value: any) {
    if (this.control?.value !== value) {
      this.control?.setValue(value, { emitEvent: false });
      this.control?.markAsTouched();
      this.control?.markAsDirty();
      this.control?.updateValueAndValidity();
    }
  }

  updateListOfValues(val: any[]) {
    if(!val[0] || !val[0][this.map().code.key] && !val[0][this.map().desc.key]){
      this._listOfValues.set([]);
      return;
    }
    this._listOfValues.set([...val]);
  }

  fetchLov(desc?: string | null) {
    const config: AutoCompleteConfig = {
      url: this.acUrl(),
      map: this.map(),
      searchName: this.searchName(),
      desc: desc,
      type: 'lov',
    };
    this.focus.set(true);
    this.executeCommand(config);
  }

  fetchDesc(code: string|number) {
    const config: AutoCompleteConfig = {
      url: this.acUrl(),
      code: code,
      map: this.map(),
      type: 'autocomplete',
    };
    this.executeCommand(config);
  }

  getPath(value: any, type: 'autocomplete'|'lov'): any {
    const path = this.resultPath()[type];
    
    if (!path || !value || !path.length) {
      return value;
    }

    const pathParts = path.split('.');
    
    let result = value;
    
    result = pathParts.reduce((acc, part) => (acc && typeof acc === 'object' && part in acc) ? acc[part] : null, result);
    
    return result;
  }

  executeCommand(configs: AutoCompleteConfig) {
    if(this.fetchDescCommand.running()) return;
    this.fetchDescCommand.execute(configs);
    this.fetchDescCommand.result()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          const processedRes = this.getPath(res, configs.type);
          
          if (!Array.isArray(processedRes)) {
            if (processedRes) {
              this.values = processedRes;
              this.updateListOfValues([processedRes]);
              this.onPerformed.emit({
                type: configs.type,
                data: processedRes,
                status: Status.SUCCESS
              });
            } else {
              this.values = null;
              this.onPerformed.emit({
                type: configs.type,
                data: null,
                status: Status.EMPTY
              });
            }
            return;
          }
          
          if (processedRes.length === 0) {
            this.values = null;
            this.updateListOfValues([]);
            this.onPerformed.emit({
              type: configs.type,
              data: null,
              status: Status.EMPTY
            });
            return;
          }
          
          if (processedRes.length > 1) {
            this.updateListOfValues(processedRes);
            this.focus.set(true);
            this.onPerformed.emit({
              type: configs.type,
              data: processedRes,
              status: Status.SUCCESS
            });
            return;
          }
          
          this.values = processedRes[0];
          this.updateListOfValues(processedRes);
          this.onPerformed.emit({
            type: configs.type,
            data: processedRes[0],
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
      this.control?.patchValue(null, { emitEvent: false });
      this.map().addons?.forEach((addon) => {
        if (addon.setValue) addon.setValue(null);
      });
      return;
    }
    
    if (!value[this.map().code.key] && !value[this.map().desc.key]) {
      this.descControl.setValue('', { emitEvent: false });
      this.control?.patchValue(null, { emitEvent: false });
      return;
    }
    
    this.completeDescFromResponse = value;
    this.control?.patchValue(value[this.map().code.key], { emitEvent: false });
    
    this.map().addons?.forEach((addon) => {
      const newValue = value[addon.key];
      if (newValue && addon.setValue) addon.setValue(value);
    });
  }

  set completeDescFromResponse(value: any) {
    this.descControl.setValue(`${value[this.map().code.key]} - ${value[this.map().desc.key]}`, { emitEvent: false });
  }

  setCompleteDesc() {
    this.descControl.setValue(this.getCompleteDesc(), { emitEvent: false });
  }

  getCompleteDesc(): string {
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