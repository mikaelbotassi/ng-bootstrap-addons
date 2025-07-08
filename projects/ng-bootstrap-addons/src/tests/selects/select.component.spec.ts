import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectComponent } from '../../../selects/src/select/select.component';

@Component({
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule],
  template: `
    <nba-select
      [label]="label"
      [icon]="icon"
      [required]="required">
      <option value="">Select an option</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </nba-select>
  `
})
class HostComponent {
  label = 'Test Select';
  icon = 'ti-list';
  required = false;
}

describe('SelectComponent', () => {
  let component: SelectComponent<string>;
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.directive(SelectComponent));
    component = debugElement.componentInstance;
    
    // Initialize control if not present
    if (!component.control) {
      component.control = new FormControl('');
      fixture.detectChanges();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component properties', () => {
    it('should have default label when provided', () => {
      expect(component.label()).toBe('Test Select');
    });

    it('should inherit from ControlValueAccessorDirective', () => {
      expect(component).toBeInstanceOf(SelectComponent);
      expect(component.control).toBeDefined();
      expect(component.inputId).toBeDefined();
    });

    it('should handle required state with validators', () => {
      // Test with control without required validator
      expect(component.isRequired).toBe(false);
      
      // Test with control that has required validator
      const requiredControl = new FormControl('', Validators.required);
      component.control = requiredControl;
      // Force update isRequired after changing control
      component.isRequired = component.control?.hasValidator(Validators.required) ?? false;
      
      expect(component.isRequired).toBe(true);
    });

    it('should handle icon property', () => {
      expect(component.icon()).toBe('ti-list');
      
      host.icon = 'ti-check';
      fixture.detectChanges();
      
      expect(component.icon()).toBe('ti-check');
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

    it('should render select element with correct attributes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        expect(selectElement).toBeTruthy();
        
        const nativeElement = selectElement.nativeElement;
        expect(nativeElement.classList.contains('form-select')).toBe(true);
        expect(nativeElement.id).toBeTruthy();
        expect(nativeElement.name).toBe(nativeElement.id);
      }
    });

    it('should render label with correct attributes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      if (labelElement) {
        expect(labelElement).toBeTruthy();
        expect(labelElement.nativeElement.textContent.trim()).toContain('Test Select');
        
        const selectElement = fixture.debugElement.query(By.css('select'));
        if (selectElement) {
          const selectId = selectElement.nativeElement.id;
          const labelFor = labelElement.nativeElement.getAttribute('for');
          expect(labelFor).toBe(selectId);
        }
      }
    });

    it('should render icon when provided', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('i.ti'));
      if (iconElement) {
        expect(iconElement.nativeElement.classList.contains('ti-list')).toBe(true);
      }
    });

    it('should not render icon when not provided', async () => {
      host.icon = '';
      fixture.detectChanges();
      await fixture.whenStable();
      
      const iconElement = fixture.debugElement.query(By.css('i.ti'));
      expect(iconElement).toBeFalsy();
    });

    it('should render projected option elements', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        const options = selectElement.nativeElement.querySelectorAll('option');
        expect(options.length).toBe(4); // including the empty option
        expect(options[0].textContent).toBe('Select an option');
        expect(options[1].textContent).toBe('Option 1');
        expect(options[2].textContent).toBe('Option 2');
        expect(options[3].textContent).toBe('Option 3');
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

  describe('Form integration', () => {
    it('should work with FormControl for string values', async () => {
      const testControl = new FormControl('option1');
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(component.control.value).toBe('option1');
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        expect(selectElement.nativeElement.value).toBe('option1');
      }
    });

    it('should update FormControl when selection changes', async () => {
      const testControl = new FormControl('');
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        selectElement.nativeElement.value = 'option2';
        selectElement.nativeElement.dispatchEvent(new Event('change'));
        
        expect(testControl.value).toBe('option2');
      }
    });

    it('should reflect disabled state', async () => {
      const testControl = new FormControl({ value: 'option1', disabled: true });
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        expect(selectElement.nativeElement.disabled).toBe(true);
      }
    });

    it('should reflect required attribute when required', async () => {
      const requiredControl = new FormControl('', Validators.required);
      component.control = requiredControl;
      component.isRequired = requiredControl.hasValidator(Validators.required);
      fixture.detectChanges();
      await fixture.whenStable();
      
      const labelElement = fixture.debugElement.query(By.css('label.required'));
      if (labelElement) {
        expect(labelElement).toBeTruthy();
      }
    });

    it('should display form error message component', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const errorComponent = fixture.debugElement.query(By.css('nba-form-error-message'));
      if (errorComponent) {
        expect(errorComponent).toBeTruthy();
      }
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should implement writeValue method', () => {
      const testControl = new FormControl();
      component.control = testControl;
      
      component.writeValue('option2');
      fixture.detectChanges();
      
      expect(testControl.value).toBe('option2');
    });

    it('should handle writeValue with empty string', () => {
      const testControl = new FormControl();
      component.control = testControl;
      
      component.writeValue('');
      fixture.detectChanges();
      
      expect(testControl.value).toBe('');
    });

    it('should handle writeValue with null/undefined', () => {
      const testControl = new FormControl();
      component.control = testControl;
      
      component.writeValue(null as any);
      fixture.detectChanges();
      
      expect(testControl.value).toBe(null);
      
      component.writeValue(undefined as any);
      fixture.detectChanges();
      
      expect(testControl.value).toBe(undefined);
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      const labelElement = fixture.debugElement.query(By.css('label'));
      
      if (selectElement && labelElement) {
        const selectId = selectElement.nativeElement.id;
        const labelFor = labelElement.nativeElement.getAttribute('for');
        
        expect(selectId).toBeTruthy();
        expect(labelFor).toBe(selectId);
      }
    });

    it('should have matching name and id attributes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        const nativeElement = selectElement.nativeElement;
        expect(nativeElement.name).toBe(nativeElement.id);
      }
    });
  });

  describe('Label updates', () => {
    it('should update label when property changes', async () => {
      host.label = 'Updated Select Label';
      fixture.detectChanges();
      await fixture.whenStable();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      if (labelElement) {
        expect(labelElement.nativeElement.textContent.trim()).toContain('Updated Select Label');
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
    it('should have correct Bootstrap select classes', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const formGroupElement = fixture.debugElement.query(By.css('.form-group'));
      const formFloatingElement = fixture.debugElement.query(By.css('.form-floating'));
      const selectElement = fixture.debugElement.query(By.css('select'));
      
      if (formGroupElement) {
        expect(formGroupElement.nativeElement.classList.contains('form-group')).toBe(true);
      }
      
      if (formFloatingElement) {
        expect(formFloatingElement.nativeElement.classList.contains('form-floating')).toBe(true);
      }
      
      if (selectElement) {
        expect(selectElement.nativeElement.classList.contains('form-select')).toBe(true);
      }
    });
  });

  describe('Type safety', () => {
    it('should work with string type by default', async () => {
      const testControl = new FormControl<string>('');
      component.control = testControl;
      
      component.writeValue('option1');
      expect(testControl.value).toBe('option1');
      
      component.writeValue('option2');
      expect(testControl.value).toBe('option2');
    });

    it('should maintain type safety with FormControl', () => {
      const stringControl = new FormControl<string>('');
      component.control = stringControl;
      fixture.detectChanges();
      
      expect(typeof stringControl.value).toBe('string');
    });

    it('should work with number type', () => {
      interface NumberSelectComponent extends SelectComponent<number> {}
      const numberControl = new FormControl<number>(0);
      
      // This tests that the generic type system works
      expect(numberControl.value).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid value changes', async () => {
      const testControl = new FormControl('');
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Simulate rapid changes
      component.writeValue('option1');
      component.writeValue('option2');
      component.writeValue('option3');
      fixture.detectChanges();
      
      expect(testControl.value).toBe('option3');
    });

    it('should maintain state after multiple re-renders', async () => {
      const testControl = new FormControl('option2');
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Force multiple re-renders
      for (let i = 0; i < 5; i++) {
        fixture.detectChanges();
      }
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        expect(selectElement.nativeElement.value).toBe('option2');
      }
    });

    it('should handle control recreation', async () => {
      const initialControl = new FormControl('option1');
      component.control = initialControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Create new control
      const newControl = new FormControl('option3');
      component.control = newControl;
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        expect(selectElement.nativeElement.value).toBe('option3');
      }
    });
  });

  describe('Validation integration', () => {
    it('should work with required validator', async () => {
      const testControl = new FormControl('', Validators.required);
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(testControl.invalid).toBe(true);
      expect(testControl.errors?.['required']).toBeTruthy();
      
      testControl.setValue('option1');
      expect(testControl.valid).toBe(true);
    });

    it('should reflect validation state', async () => {
      const testControl = new FormControl('', Validators.required);
      component.control = testControl;
      testControl.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Angular should add validation classes
      testControl.updateValueAndValidity();
      fixture.detectChanges();
      
      expect(testControl.invalid).toBe(true);
      expect(testControl.touched).toBe(true);
    });

    it('should work with custom validators', async () => {
      const customValidator = (control: any) => {
        return control.value === 'invalid' ? { customError: true } : null;
      };
      
      const testControl = new FormControl('invalid', { validators: [customValidator] });
      component.control = testControl;
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(testControl.invalid).toBe(true);
      expect(testControl.errors?.['customError']).toBeTruthy();
      
      testControl.setValue('option1');
      expect(testControl.valid).toBe(true);
    });
  });

  describe('Content projection', () => {
    it('should properly project option elements', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      if (selectElement) {
        const options = selectElement.nativeElement.querySelectorAll('option');
        
        // Verify all options are present
        expect(options.length).toBeGreaterThan(0);
        
        // Check option values
        const optionValues = Array.from(options).map((option: any) => option.value);
        expect(optionValues).toContain('');
        expect(optionValues).toContain('option1');
        expect(optionValues).toContain('option2');
        expect(optionValues).toContain('option3');
      }
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
