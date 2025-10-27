import { booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, forwardRef, input, signal, ViewEncapsulation } from '@angular/core';
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
      position: relative;
      .bs-datepicker{
        position:absolute;
        top: 0 !important;
        left: var(--custom-left) !important;
        transform: none !important;
      }
    }
    
    // /* ✅ CORREÇÃO: Também aplicar aos elementos internos se necessário */
    // .custom-positioned .bs-datepicker-container {
    //   left: var(--custom-left) !important;
    //   top: var(--custom-top) !important;
    //   transform: none !important;
    // }
    
    // /* ✅ CORREÇÃO: Para o datepicker interno */
    // .custom-positioned .bs-datepicker {
    //   position: static !important;
    // }
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
  
  baseConfigs = computed<Partial<BsDaterangepickerConfig>>(() => {
    const withTime = this.withTime();
    const dateFormat = withTime ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY';
    
    return {
      dateInputFormat: dateFormat,
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
      this.control?.setValue(undefined);
      return;
    }
    
    let [start, end] = newValue;
    if (!start || !end) {
      this.control?.setValue(undefined);
      return;
    }
    
    if(end < start){
      [start, end] = [end, start];
    }

    this.control?.setValue([start, end]);
  }

  private resizeObserver?: ResizeObserver;
  onShown = signal(false);

  onCalendarShown = effect(() => {
    const calendarShow = this.onShown();
    const input = this.inputRef();
    if(!calendarShow && !input) return;
    this.adjustCalendarPosition();
  });

  private adjustCalendarPosition() {
    const container = document.querySelector('bs-daterangepicker-container') as HTMLElement;
    if (container) {
      this.positionCalendarContainer(container);
    }
  }
  
  private positionCalendarContainer(container: HTMLElement) {
    const inputElement = this.inputRef()!.nativeElement as unknown as HTMLInputElement;
    if (!inputElement) return;
    
    const inputRect = inputElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    if (inputRect.right + containerRect.width > viewportWidth) {
      const leftPosition = Math.max(16, inputRect.right - containerRect.width);
      const topPosition = inputRect.bottom + 4; // 4px de offset
      
      container.style.setProperty('--custom-left', `${containerRect.width}px`);
    }
  }
}