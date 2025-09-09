// datetime-range-picker.component.ts
import { booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, forwardRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { CommonModule } from '@angular/common';
import { ControlValueAccessorDirective } from 'ng-bootstrap-addons/directives';
import { ClickOutsideDirective } from 'ng-bootstrap-addons/directives';
import {createRandomString, DateUtils} from 'ng-bootstrap-addons/utils';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'nba-date-range-picker',
  imports: [CommonModule, BsDatepickerModule, ReactiveFormsModule, FormErrorMessageComponent, InputPlaceholderComponent, NgxMaskDirective, CollapseModule, ClickOutsideDirective, FormsModule],
  templateUrl: './date-range-picker.component.html',
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
export class DateRangePickerComponent extends ControlValueAccessorDirective<(Date|undefined)[]|undefined> {
  
  withTime = input(false, {transform: booleanAttribute});
  
  textValue = computed(() => {
    const control = new FormControl<string|null|undefined>(null, {
      validators: [
        this.withTime() 
          ? Validators.pattern(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/)
          : Validators.pattern(/^\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}$/)
      ]
    });
    return control;
  });

  private destroyRef = inject(DestroyRef);
  timeOutHandle: ReturnType<typeof setTimeout> | null = null;
  isCollapsed = signal<boolean>(true);
  cdr = inject(ChangeDetectorRef);
  customConfigs = input<Partial<BsDaterangepickerConfig>>({});
  
  baseConfigs = computed<Partial<BsDaterangepickerConfig>>(() => {
    const withTime = this.withTime();
    const dateFormat = withTime ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY';
    
    return {
      dateInputFormat: dateFormat,
      showWeekNumbers: false,
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

  bsConfigs = computed(() => {
    return {
      ...this.baseConfigs(),
      ...this.customConfigs(),
    };
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

  toggleCollapse() {
    this.isCollapsed.update((prev) => !prev);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    
    this.textValue().valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((val) => {
      this.writeTextInterval(val);
    });
    
    this.control?.statusChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      if(this.control?.disabled) this.textValue().disable({emitEvent: false});
    });
  }

  writeTextInterval(value: string|null|undefined): void {
    if (this.timeOutHandle) clearTimeout(this.timeOutHandle);
    
    this.timeOutHandle = setTimeout(() => {
      if(!value) return;

      const expectedLength = this.withTime() ? 28 : 16;
      if(value.length !== expectedLength) return;

      if(this.withTime()) return this.writeDateWithTime(value);
      return this.writeDate(value);
  
    }, 1000);
  }

  writeDate(value: string): void {
    try {
        // Divide a string em duas partes
        const startBrDate = value.slice(0, 8); // Primeiros 8 caracteres
        const endBrDate = value.slice(8);     // Restantes 8 caracteres
    
        if (startBrDate && endBrDate) {
          // Converte as strings para o formato brasileiro
          const startDate = DateUtils.fromBrazilianDate(
            `${startBrDate.slice(0, 2)}/${startBrDate.slice(2, 4)}/${startBrDate.slice(4, 8)}`
          );
          const endDate = DateUtils.fromBrazilianDate(
            `${endBrDate.slice(0, 2)}/${endBrDate.slice(2, 4)}/${endBrDate.slice(4, 8)}`
          );
    
          if (startDate && endDate) {
            // Atualiza o controle com as datas
            this.control?.setValue([startDate, endDate]);
            return;
          }
        }
      } catch (error) {
        // Se houver erro na conversão de datas, define como undefined
        this.control?.setValue(undefined);
        return;
      }
  }

  writeDateWithTime(value: string): void {
    try {
        // Divide a string em duas partes
        const startBrDate = value.slice(0, 14); // Primeiros 14 caracteres
        const endBrDate = value.slice(14);     // Restantes 14 caracteres
    
        if (startBrDate && endBrDate) {
          // Converte as strings para o formato brasileiro
          const startDate = DateUtils.fromBrazilianDate(
            `${startBrDate.slice(0, 2)}/${startBrDate.slice(2, 4)}/${startBrDate.slice(4, 8)} ${startBrDate.slice(8, 10)}:${startBrDate.slice(10, 12)}:${startBrDate.slice(12, 14)}`
          );
          const endDate = DateUtils.fromBrazilianDate(
            `${endBrDate.slice(0, 2)}/${endBrDate.slice(2, 4)}/${endBrDate.slice(4, 8)} ${endBrDate.slice(8, 10)}:${endBrDate.slice(10, 12)}:${endBrDate.slice(12, 14)}`
          );
    
          if (startDate && endDate) {
            // Atualiza o controle com as datas
            this.control?.setValue([startDate, endDate]);
            return;
          }
        }
      } catch (error) {
        // Se houver erro na conversão de datas, define como undefined
        this.control?.setValue(undefined);
        return;
      }
  }

  markAsTouched() {
    this.control?.markAsTouched();
  }  

  onDatePickerChange(newValue: (Date|undefined)[]|undefined) {
    if(!newValue){
      this.textValue().patchValue(null, {emitEvent: false});
      this.control?.setValue(undefined);
      return;
    }
    
    const [start, end] = newValue;
    if (!start || !end) {
      this.textValue().patchValue(null, { emitEvent: false });
      this.control?.setValue(undefined);
      return;
    }
    
    this.control?.setValue(newValue);
    
    const withTime = this.withTime();
    const format = withTime ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY';
    const formatted = `${DateUtils.formatDate(start, format)} - ${DateUtils.formatDate(end, format)}`;
    this.textValue().patchValue(formatted, { emitEvent: false });
  }

  override writeValue(value: (Date | undefined)[] | undefined): void {
    if (value?.[0] && value?.[1]) {
      const withTime = this.withTime();
      const format = withTime ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY';
      const formatted = `${DateUtils.formatDate(value[0], format)} - ${DateUtils.formatDate(value[1], format)}`;
      this.textValue().patchValue(formatted, { emitEvent: false });
    } else {
      this.textValue().patchValue(null, { emitEvent: false });
    }
  }
}