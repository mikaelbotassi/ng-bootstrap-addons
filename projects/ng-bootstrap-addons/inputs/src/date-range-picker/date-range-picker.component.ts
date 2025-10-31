import { booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, forwardRef, inject, Injector, input, signal, ViewEncapsulation } from '@angular/core';
import { BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import {createRandomString, DateUtils} from 'ng-bootstrap-addons/utils';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'nba-date-range-picker',
  imports: [CommonModule, BsDatepickerModule, ReactiveFormsModule, FormErrorMessageComponent, InputPlaceholderComponent, NgxMaskDirective, FormsModule],
  templateUrl: './date-range-picker.component.html',
  styles: `
    bs-daterangepicker-container td { font-weight: normal }
    
    bs-daterangepicker-container {
      transform: none !important;
      top: var(--custom-top) !important;
      left: var(--custom-left) !important;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  host: { 'collision-id': `date-range-picker-${createRandomString(20)} ` },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent extends ControlValueAccessorDirective<(Date|undefined)[]|undefined>{
  
  withTime = input(false, {transform: booleanAttribute});
  timeOutHandle: ReturnType<typeof setTimeout> | null = null;
  isCollapsed = signal<boolean>(true);
  customConfigs = input<Partial<BsDaterangepickerConfig>>({});

  displayValue = computed(() => {
    const v = this.value();
    if(!v || !v[0] || !v[1]){
      return '';
    }
    const fmt = this.FMT();
    return `${DateUtils.formatDate(v[0], fmt)} - ${DateUtils.formatDate(v[1], fmt)}`;
  });

  setValue = effect(() => {
    const inputRef = this.inputRef();
    const v = this.displayValue();
    if(!inputRef) return;
    const el = inputRef.nativeElement as unknown as HTMLInputElement;
    if (el && el.value !== v) el.value = v;
    queueMicrotask(() => {
      if (el && el.value !== v) el.value = v;
    });
  });

  value = signal<(Date|undefined)[]|undefined>(undefined);
  FMT = computed(() => this.withTime() ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY');

  baseConfigs = computed<Partial<BsDaterangepickerConfig>>(() => {
    const withTime = this.withTime();
    const dateFormat = withTime ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY';
    
    return {
      dateInputFormat: dateFormat,
      container: 'body',
      adaptivePosition: false,
      keepDatepickerOpened: true,
      showWeekNumbers: false,
      containerClass: 'custom-position',
      rangeInputFormat: dateFormat,
      withTimepicker: withTime,
      ranges: withTime ? [
        { label: 'Hoje', value: [
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 00:00:00')),
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 23:59:59'))
        ] },
        { label: 'Últimos 7 dias', value: [
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 00:00:00')),
          DateUtils.addDaysFromString(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 00:00:00'), 7)
        ] },
        { label: 'Últimos 30 dias', value: [
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 00:00:00')),
          DateUtils.addDaysFromString(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 00:00:00'), 30)
        ] },
        { label: 'Últimos 90 dias', value: [
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 00:00:00')),
          DateUtils.addDaysFromString(DateUtils.getFormattedCurrentDate('YYYY-MM-DD 00:00:00'), 90)
        ]}
      ] : [
        { label: 'Hoje', value: [
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD')),
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD'))
        ] },
        { label: 'Últimos 7 dias', value: [
          DateUtils.addDaysFromString(DateUtils.getFormattedCurrentDate('YYYY-MM-DD'), -7),
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD'))
        ] },
        { label: 'Últimos 30 dias', value: [
          DateUtils.addDaysFromString(DateUtils.getFormattedCurrentDate('YYYY-MM-DD'), -30),
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD'))
        ] },
        { label: 'Últimos 90 dias', value: [
          DateUtils.addDaysFromString(DateUtils.getFormattedCurrentDate('YYYY-MM-DD'), -90),
          DateUtils.toDate(DateUtils.getFormattedCurrentDate('YYYY-MM-DD'))
        ]}
      ],
    };
  });

  bsConfigs = computed<Partial<BsDaterangepickerConfig>>(() => {
    const configs = {
      ...this.baseConfigs(),
      ...this.customConfigs(),
    };
    return configs;
  });

  inputMask = computed(() => {
    return this.withTime() 
      ? '00/00/0000 00:00:00 - 00/00/0000 00:00:00'
      : '00/00/0000 - 00/00/0000';
  });

  inputPlaceholder = computed(() => {
    return this.withTime() 
      ? 'dd/mm/aaaa hh:mm:ss - dd/mm/aaaa hh:mm:ss'
      : 'dd/mm/aaaa - dd/mm/aaaa';
  });

  markAsTouched() {
    this.control?.markAsTouched();
  }  

  onDatePickerChange(newValue: (Date|undefined)[]|undefined) {
    if(newValue === this.control?.value) return;
    if(!newValue){
      this.propagateValue(undefined);
      return;
    }
    
    let [start, end] = newValue;
    if (!start || !end) {
      this.propagateValue(undefined);
      return;
    }
    
    if(end < start){
      [start, end] = [end, start];
    }

    this.propagateValue([start, end])
  }

  private clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

override ngOnInit(){
  super.ngOnInit();
  this.control?.valueChanges.subscribe(v => { this.value.set(v); });
}

private getContainer(): HTMLElement | null {
  const list = document.querySelectorAll('bs-daterangepicker-container');
  return list.length ? (list[list.length - 1] as HTMLElement) : null;
}

private positionCalendarContainer(container: HTMLElement) {
  const inputEl = this.inputRef()?.nativeElement as unknown as HTMLInputElement;
  if (!inputEl) return;

  const ir = inputEl.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const sx = window.scrollX || window.pageXOffset;
  const sy = window.scrollY || window.pageYOffset;

  const GAP = 4;
  const PAD = 16;

  container.style.top = `-9999px`;
  container.style.left = `-9999px`;

  const inner = container.querySelector('bs-datepicker-container') as HTMLElement;
  const cw = (inner ?? container).offsetWidth;
  const ch = (inner ?? container).offsetHeight;

  let top = Math.round(ir.bottom + GAP + sy);
  if (top + ch > sy + vh) {
    top = Math.round(ir.top - ch - GAP + sy);
  }

  let left = Math.round(ir.left + sx);
  left = this.clamp(left, PAD + sx, sx + vw - cw - PAD);

  container.style.position = 'absolute';
  container.style.setProperty('--custom-left', `${left}px`);
  container.style.setProperty('--custom-top', `${top}px`);
  container.style.right = 'auto';
}


  onShown = signal(false);

  private onWindowChange = () => {
    const c = this.getContainer();
    if (c) this.positionCalendarContainer(c);
  };

  onCalendarShown = effect(() => {
    const isShown = this.onShown();
    if (!isShown) {
      window.removeEventListener('resize', this.onWindowChange);
      window.removeEventListener('scroll', this.onWindowChange, true);
      return;
    }

    const c = this.getContainer();
    if (c) {
      setTimeout(() => this.positionCalendarContainer(c), 0);
    }

    window.addEventListener('resize', this.onWindowChange, { passive: true });
    window.addEventListener('scroll', this.onWindowChange, { passive: true, capture: true });
  });
}