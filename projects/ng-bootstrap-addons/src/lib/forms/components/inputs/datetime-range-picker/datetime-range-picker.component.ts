import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, forwardRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputPlaceholderComponent } from '../input-placeholder/input-placeholder.component';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ControlValueAccessorDirective } from '../../../directives/src/control-value-acessor.directive';
import { ClickOutsideDirective } from '../../../directives/src/click-outside.directive';
import DateUtils from '../../../../../utils/src/date-utils';
import { FormErrorMessageComponent } from '../../form-error-message/src/form-error-message.component';

@Component({
  selector: 'nba-datetime-range-input',
  imports: [CommonModule, BsDatepickerModule, ReactiveFormsModule, FormErrorMessageComponent, InputPlaceholderComponent, NgxMaskDirective, CollapseModule, ClickOutsideDirective, FormsModule],
  templateUrl: './datetime-range-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeRangePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimeRangePickerComponent extends ControlValueAccessorDirective<(Date|undefined)[]|undefined> {
  
  textValue = new FormControl<string|null|undefined>(null, {validators: [
    Validators.pattern(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/),
  ]});
  private destroyRef = inject(DestroyRef);
  timeOutHandle: ReturnType<typeof setTimeout> | null = null;
  isCollapsed = signal<boolean>(true);
  cdr = inject(ChangeDetectorRef);
  customConfigs = input<Partial<BsDaterangepickerConfig>>();
  baseConfigs = signal<Partial<BsDaterangepickerConfig>>({
      dateInputFormat: 'DD/MM/YYYY HH:mm:ss',
      showWeekNumbers: false,
      rangeInputFormat: 'DD/MM/YYYY HH:mm:ss',
      withTimepicker: true,
      ranges: [
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
      ],
  });
  bsConfigs:any = computed(() => {
    return {
      ...this.customConfigs(),
      ...this.baseConfigs(),
    };
  });

  toggleCollapse() {
    this.isCollapsed.update((prev) => !prev);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.textValue.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((val) => {
      this.writeTextInterval(val);
    });
    this.control?.statusChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      if(this.control?.disabled) this.textValue.disable({emitEvent: false});
    });
  }

  writeTextInterval(value: string|null|undefined): void {
    if (this.timeOutHandle) clearTimeout(this.timeOutHandle);
  
    this.timeOutHandle = setTimeout(() => {

      if(!value) return;

      if(value.length !== 28) return;

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
  
      this.control?.setValue(undefined);
    }, 1000);
  }

  markAsTouched() {
    this.control?.markAsTouched();
  }  

  onDatePickerChange(newValue: (Date|undefined)[]|undefined) {
    
    if(!newValue){
      this.textValue.patchValue(null, {emitEvent: false});
      this.control?.setValue(undefined);
      return;
    }
    
    const [start, end] = newValue;
    if (!start || !end) {
      this.textValue.patchValue(null, { emitEvent: false });
      this.control?.setValue(undefined);
      return;
    }
    
    this.control?.setValue(newValue);
    
    const formatted = `${DateUtils.formatDate(start, 'DD/MM/YYYY HH:mm:ss')} - ${DateUtils.formatDate(end, 'DD/MM/YYYY HH:mm:ss')}`;
    this.textValue.patchValue(formatted, { emitEvent: false });

  }

  override writeValue(value: (Date | undefined)[] | undefined): void {
    if (value?.[0] && value?.[1]) {
      const formatted = `${DateUtils.formatDate(value[0], 'DD/MM/YYYY HH:mm:ss')} - ${DateUtils.formatDate(value[1], 'DD/MM/YYYY HH:mm:ss')}`;
      this.textValue.patchValue(formatted, { emitEvent: false });
    } else {
      this.textValue.patchValue(null, { emitEvent: false });
    }
  }

}
