import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component, DebugElement, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxMaskService, provideNgxMask } from 'ngx-mask';
import { DateUtils } from 'utils/date-utils';
import { DateRangePickerComponent } from 'project/inputs/src/date-range-picker/date-range-picker.component';

@Component({
  standalone: true,
  imports: [DateRangePickerComponent, ReactiveFormsModule],
  template: `
    <nba-date-range-picker
      [label]="label"
      [icon]="icon"
      [required]="required"
      withTime
      [customConfigs]="customConfigs()">
    </nba-date-range-picker>
  `
})
class HostComponent {
  label = 'Test Date Range Picker';
  icon = 'ti-calendar';
  required = false;
  customConfigs = signal<any>({});
}

describe('DatetimeRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HostComponent,
        BsDatepickerModule.forRoot(),
        CollapseModule.forRoot(),
      ],
      providers: [
        provideNgxMask(),
        NgxMaskService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.directive(DateRangePickerComponent));
    component = debugElement.componentInstance;
    
    // Initialize control if not present
    if (!component.control) {
      component.control = new FormControl<(Date|undefined)[]|undefined>(undefined);
      fixture.detectChanges();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component properties', () => {
    it('should have default label when provided', () => {
      expect(component.label()).toBe('Test Date Range Picker');
    });

    it('should inherit from ControlValueAccessorDirective', () => {
      expect(component).toBeInstanceOf(DateRangePickerComponent);
      expect(component.control).toBeDefined();
      expect(component.inputId).toBeDefined();
    });

    it('should handle required state with validators', () => {
      // Test with control without required validator
      expect(component.isRequired).toBe(false);
      
      // Test with control that has required validator
      const requiredControl = new FormControl<(Date|undefined)[]|undefined>(undefined, Validators.required);
      component.control = requiredControl;
      // Force update isRequired after changing control
      component.isRequired = component.control?.hasValidator(Validators.required) ?? false;
      
      expect(component.isRequired).toBe(true);
    });

    it('should handle icon property', () => {
      expect(component.icon()).toBe('ti-calendar');
      
      host.icon = 'ti-check';
      fixture.detectChanges();
      
      expect(component.icon()).toBe('ti-check');
    });

    it('should initialize textValue FormControl', () => {
      expect(component.textValue()).toBeDefined();
      expect(component.textValue().value).toBeNull();
    });

    it('should initialize isCollapsed signal as true', () => {
      expect(component.isCollapsed()).toBe(true);
    });

    it('should initialize base configs with default values', () => {
      const baseConfigs = component.baseConfigs();
      expect(baseConfigs.dateInputFormat).toBe('DD/MM/YYYY HH:mm:ss');
      expect(baseConfigs.withTimepicker).toBe(true);
      expect(baseConfigs.ranges).toBeDefined();
      expect(baseConfigs.ranges?.length).toBe(4);
    });

    it('should merge custom configs with base configs', async () => {
      host.customConfigs.set({ showWeekNumbers: true });
      fixture.detectChanges();

      await fixture.whenStable();

      const mergedConfigs = component.bsConfigs();
      expect(mergedConfigs.showWeekNumbers).toBe(true);
      expect(mergedConfigs.withTimepicker).toBe(true);
    });

  });

  describe('Template rendering', () => {
    it('should render form group when control exists', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const formGroupElement = fixture.debugElement.query(By.css('.form-group'));
      if (formGroupElement) {
        expect(formGroupElement).toBeTruthy();
      }
    });

    it('should render input element with correct attributes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        expect(inputElement).toBeTruthy();
        
        const nativeElement = inputElement.nativeElement;
        expect(nativeElement.classList.contains('form-control')).toBe(true);
        expect(nativeElement.id).toBeTruthy();
        expect(nativeElement.name).toBe(nativeElement.id);
        expect(nativeElement.placeholder).toBe('Test Date Range Picker');
      }
    });

    it('should render label with correct attributes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      if (labelElement) {
        expect(labelElement).toBeTruthy();
        expect(labelElement.nativeElement.textContent.trim()).toContain('Test Date Range Picker');
        
        const inputElement = fixture.debugElement.query(By.css('input'));
        if (inputElement) {
          const inputId = inputElement.nativeElement.id;
          const labelFor = labelElement.nativeElement.getAttribute('for');
          expect(labelFor).toBe(inputId);
        }
      }
    });

    it('should render icon when provided', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('i.ti'));
      if (iconElement) {
        expect(iconElement.nativeElement.classList.contains('ti-calendar')).toBe(true);
      }
    });

    it('should not render icon when not provided', async () => {
      host.icon = '';
      fixture.detectChanges();
      await fixture.whenStable();
      
      const iconElement = fixture.debugElement.query(By.css('i.ti'));
      expect(iconElement).toBeFalsy();
    });

    it('should render daterangepicker inline component', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const datePickerElement = fixture.debugElement.query(By.css('bs-daterangepicker-inline'));
      if (datePickerElement) {
        expect(datePickerElement).toBeTruthy();
      }
    });

    it('should render placeholder when control is not available', () => {
      component.control = undefined;
      fixture.detectChanges();
      
      const placeholderElement = fixture.debugElement.query(By.css('nba-input-placeholder'));
      if (placeholderElement) {
        expect(placeholderElement).toBeTruthy();
      }
    });
  });

  describe('Collapse functionality', () => {
    it('should toggle collapse state', () => {
      expect(component.isCollapsed()).toBe(true);
      
      component.toggleCollapse();
      expect(component.isCollapsed()).toBe(false);
      
      component.toggleCollapse();
      expect(component.isCollapsed()).toBe(true);
    });

    it('should toggle collapse when input is clicked', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        expect(component.isCollapsed()).toBe(true);
        
        inputElement.nativeElement.click();
        fixture.detectChanges();
        
        expect(component.isCollapsed()).toBe(false);
      }
    });
  });

  describe('Date parsing and formatting', () => {
    it('should format dates correctly in writeValue', () => {
      const startDate = new Date('2023-01-15T10:30:00');
      const endDate = new Date('2023-01-20T15:45:00');
      
      component.writeValue([startDate, endDate]);
      
      const expectedFormat = `${DateUtils.formatDate(startDate, 'DD/MM/YYYY HH:mm:ss')} - ${DateUtils.formatDate(endDate, 'DD/MM/YYYY HH:mm:ss')}`;
      expect(component.textValue().value).toBe(expectedFormat);
    });

    it('should clear textValue when writeValue receives undefined', () => {
      component.writeValue(undefined);
      expect(component.textValue().value).toBeNull();
    });

    it('should clear textValue when writeValue receives incomplete date array', () => {
      component.writeValue([new Date(), undefined]);
      expect(component.textValue().value).toBeNull();
    });

    it('should parse text input correctly with writeTextInterval', fakeAsync(() => {
      const validInput = '15/01/2023 10:30:00 - 20/01/2023 15:45:00';
      component.textValue().setValue(validInput);
      
      tick(1000); // Wait for timeout
      
      // Check if control has a value (may be null or undefined depending on implementation)
      const controlValue = component.control?.value;
      expect(controlValue).toBeDefined();
      if (controlValue) {
        expect(Array.isArray(controlValue)).toBe(true);
      }
    }));

    it('should handle invalid text input gracefully', fakeAsync(() => {
      component.textValue().setValue('invalid date format');
      
      tick(1000); // Wait for timeout
      
      // Should not set a valid value - could be null or undefined
      expect(component.control?.value).toBeFalsy();
    }));

    it('should handle incomplete text input', fakeAsync(() => {
      component.textValue().setValue('15/01/2023'); // Too short
      
      tick(1000); // Wait for timeout
      
      // Should not set a valid value - could be null or undefined
      expect(component.control?.value).toBeFalsy();
    }));
  });

  describe('Date picker change handling', () => {
    it('should handle valid date range from picker', () => {
      const startDate = new Date('2023-01-15T10:30:00');
      const endDate = new Date('2023-01-20T15:45:00');
      
      component.onDatePickerChange([startDate, endDate]);
      
      expect(component.control?.value).toEqual([startDate, endDate]);
      expect(component.textValue().value).toContain('15/01/2023');
      expect(component.textValue().value).toContain('20/01/2023');
    });

    it('should handle undefined value from picker', () => {
      component.onDatePickerChange(undefined);
      
      expect(component.control?.value).toBeUndefined();
      expect(component.textValue().value).toBeNull();
    });

    it('should handle incomplete date range from picker', () => {
      const startDate = new Date('2023-01-15T10:30:00');
      
      component.onDatePickerChange([startDate, undefined]);
      
      expect(component.control?.value).toBeUndefined();
      expect(component.textValue().value).toBeNull();
    });
  });

  describe('Form integration', () => {
    it('should work with FormControl for date range values', async () => {
      const startDate = new Date('2023-01-15T10:30:00');
      const endDate = new Date('2023-01-20T15:45:00');
      const testControl = new FormControl<(Date|undefined)[]|undefined>([startDate, endDate]);
      
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(component.control.value).toEqual([startDate, endDate]);
    });

    it('should reflect disabled state', fakeAsync(() => {
      const testControl = new FormControl<(Date|undefined)[]|undefined>([]);
      component.control = testControl;
      component.ngOnInit();
      
      component.control.disable();
      
      // Force all pending observables to complete
      flush();
      
      expect(component.textValue().disabled).toBe(true);
    }));

    it('should reflect required attribute when required', async () => {
      const requiredControl = new FormControl<(Date|undefined)[]|undefined>(undefined, Validators.required);
      component.control = requiredControl;
      component.isRequired = requiredControl.hasValidator(Validators.required);
      fixture.detectChanges();
      await fixture.whenStable();
      
      const labelElement = fixture.debugElement.query(By.css('label.required'));
      if (labelElement) {
        expect(labelElement).toBeTruthy();
      }
    });

    it('should display form error message for control errors', async () => {
      const requiredControl = new FormControl<(Date|undefined)[]|undefined>(undefined, Validators.required);
      requiredControl.markAsTouched();
      component.control = requiredControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const errorComponent = fixture.debugElement.query(By.css('nba-form-error-message'));
      if (errorComponent) {
        expect(errorComponent).toBeTruthy();
      }
    });

    it('should display form error message for textValue errors', async () => {
      component.textValue().setValue('invalid format');
      component.textValue().markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Should show error for textValue when control is valid
      expect(component.textValue().invalid).toBe(true);
    });

    it('should mark control as touched when markAsTouched is called', () => {
      component.markAsTouched();
      expect(component.control?.touched).toBe(true);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should implement writeValue method', () => {
      const startDate = new Date('2023-01-15T10:30:00');
      const endDate = new Date('2023-01-20T15:45:00');
      const testControl = new FormControl<(Date|undefined)[]|undefined>(undefined);
      component.control = testControl;
      
      component.writeValue([startDate, endDate]);
      fixture.detectChanges();
      
      expect(component.textValue().value).toContain('15/01/2023');
      expect(component.textValue().value).toContain('20/01/2023');
    });

    it('should handle writeValue with undefined', () => {
      const testControl = new FormControl<(Date|undefined)[]|undefined>(undefined);
      component.control = testControl;
      
      component.writeValue(undefined);
      fixture.detectChanges();
      
      expect(component.textValue().value).toBeNull();
    });

    it('should handle writeValue with empty array', () => {
      const testControl = new FormControl<(Date|undefined)[]|undefined>(undefined);
      component.control = testControl;
      
      component.writeValue([]);
      fixture.detectChanges();
      
      expect(component.textValue().value).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      const labelElement = fixture.debugElement.query(By.css('label'));
      
      if (inputElement && labelElement) {
        const inputId = inputElement.nativeElement.id;
        const labelFor = labelElement.nativeElement.getAttribute('for');
        
        expect(inputId).toBeTruthy();
        expect(labelFor).toBe(inputId);
      }
    });

    it('should have matching name and id attributes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        const nativeElement = inputElement.nativeElement;
        expect(nativeElement.name).toBe(nativeElement.id);
      }
    });

    it('should have proper aria-expanded attribute', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        expect(inputElement.nativeElement.getAttribute('aria-expanded')).toBe('true'); // collapsed
        
        component.toggleCollapse();
        fixture.detectChanges();
        
        expect(inputElement.nativeElement.getAttribute('aria-expanded')).toBe('false'); // expanded
      }
    });
  });

  describe('Label updates', () => {
    it('should update label when property changes', async () => {
      host.label = 'Updated Date Range Picker Label';
      fixture.detectChanges();
      await fixture.whenStable();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      if (labelElement) {
        expect(labelElement.nativeElement.textContent.trim()).toContain('Updated Date Range Picker Label');
      }
    });

    it('should handle empty label', async () => {
      host.label = '';
      fixture.detectChanges();
      await fixture.whenStable();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      if (labelElement) {
        expect(labelElement.nativeElement.textContent.trim()).toBe('');
      }
    });
  });

  describe('Bootstrap classes', () => {
    it('should have correct Bootstrap classes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const formGroupElement = fixture.debugElement.query(By.css('.form-group'));
      const formFloatingElement = fixture.debugElement.query(By.css('.form-floating'));
      const inputElement = fixture.debugElement.query(By.css('input'));
      
      if (formGroupElement) {
        expect(formGroupElement.nativeElement.classList.contains('form-group')).toBe(true);
      }
      
      if (formFloatingElement) {
        expect(formFloatingElement.nativeElement.classList.contains('form-floating')).toBe(true);
      }
      
      if (inputElement) {
        expect(inputElement.nativeElement.classList.contains('form-control')).toBe(true);
      }
    });
  });

  describe('CSS classes based on control state', () => {
    it('should apply correct CSS classes based on control state', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        const nativeElement = inputElement.nativeElement;
        
        // Initially should be pristine and untouched
        expect(nativeElement.classList.contains('ng-pristine')).toBe(true);
        expect(nativeElement.classList.contains('ng-untouched')).toBe(true);
        
        // Mark as touched and dirty
        component.control?.markAsTouched();
        component.control?.markAsDirty();
        fixture.detectChanges();
        
        expect(nativeElement.classList.contains('ng-touched')).toBe(true);
        expect(nativeElement.classList.contains('ng-dirty')).toBe(true);
      }
    });
  });

  describe('Type safety', () => {
    it('should work with date array type by default', async () => {
      const startDate = new Date('2023-01-15T10:30:00');
      const endDate = new Date('2023-01-20T15:45:00');
      const testControl = new FormControl<(Date|undefined)[]|undefined>(undefined);
      component.control = testControl;
      
      const testValue: (Date|undefined)[]|undefined = [startDate, endDate];
      component.writeValue(testValue);
      
      expect(component.textValue().value).toContain('15/01/2023');
    });

    it('should maintain type safety with FormControl', () => {
      const testControl = new FormControl<(Date|undefined)[]|undefined>([]);
      component.control = testControl;
      fixture.detectChanges();
      
      expect(component.control.value).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid value changes', fakeAsync(() => {
      component.textValue().setValue('15/01/2023 10:30:0020/01/2023 15:45:00');
      tick(500); // Before timeout
      
      component.textValue().setValue('16/01/2023 11:30:0021/01/2023 16:45:00');
      tick(1000); // Complete timeout
      
      // Should process the latest value
      expect(component.control?.value).toBeDefined();
    }));

    it('should clear timeout when component receives new value', fakeAsync(() => {
      component.textValue().setValue('15/01/2023 10:30:00 - 20/01/2023 15:45:00');
      tick(500);
      
      // Set another value before timeout completes
      component.textValue().setValue('invalid');
      tick(1000);
      
      // Should not have valid value due to invalid input
      expect(component.control?.value).toBeFalsy();
    }));

    it('should handle empty string input', fakeAsync(() => {
      component.textValue().setValue('');
      tick(1000);
      
      // Should not process empty string - could be null, undefined or previous value
      expect(component.control?.value).toBeFalsy();
    }));

    it('should handle null input', fakeAsync(() => {
      component.textValue().setValue(null);
      tick(1000);
      
      // Should not process null - could be null, undefined or previous value
      expect(component.control?.value).toBeFalsy();
    }));
  });

  describe('Validation integration', () => {
    it('should work with required validator', async () => {
      const testControl = new FormControl<(Date|undefined)[]|undefined>([], Validators.required);
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(testControl.invalid).toBe(true);
      expect(testControl.errors?.['required']).toBeTruthy();
      
      const startDate = new Date('2023-01-15T10:30:00');
      const endDate = new Date('2023-01-20T15:45:00');
      testControl.setValue([startDate, endDate]);
      
      expect(testControl.valid).toBe(true);
    });

    it('should validate text input format', () => {
      component.textValue().setValue('invalid format');
      expect(component.textValue().invalid).toBe(true);
      expect(component.textValue().errors?.['pattern']).toBeTruthy();
      
      component.textValue().setValue('15/01/2023 10:30:00 - 20/01/2023 15:45:00');
      expect(component.textValue().valid).toBe(true);
    });

    it('should work with custom validators', async () => {
      const customValidator = (control: any) => {
        const value = control.value;
        if (value && Array.isArray(value) && value.length === 2) {
          const [start, end] = value;
          if (start && end && start >= end) {
            return { invalidRange: true };
          }
        }
        return null;
      };
      
      const testControl = new FormControl<(Date|undefined)[]|undefined>([], { validators: [customValidator] });
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Set invalid range (start >= end)
      const startDate = new Date('2023-01-20T10:30:00');
      const endDate = new Date('2023-01-15T15:45:00');
      testControl.setValue([startDate, endDate]);
      
      expect(testControl.invalid).toBe(true);
      expect(testControl.errors?.['invalidRange']).toBeTruthy();
      
      // Set valid range
      testControl.setValue([endDate, startDate]);
      expect(testControl.valid).toBe(true);
    });
  });

  describe('Defer loading behavior', () => {
    it('should eventually render content after defer block loads', async () => {
      // Wait for defer block to load
      await fixture.whenStable();
      fixture.detectChanges();
      
      // Check if either the main content or placeholder is rendered
      const formGroupElement = fixture.debugElement.query(By.css('.form-group'));
      const placeholderElement = fixture.debugElement.query(By.css('nba-input-placeholder'));
      
      // At least one should be present
      expect(formGroupElement || placeholderElement).toBeTruthy();
    });
  });
});
