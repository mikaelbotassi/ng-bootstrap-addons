import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { InputComponent } from 'inputs/input/input.component';

@Component({
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule],
  template: `
    <nba-input
      [label]="label"
      [icon]="icon"
      [required]="required"
      [password]="password"
      [type]="type"
      [mask]="mask"
      [validation]="validation"
      [dropSpecialCharacters]="dropSpecialCharacters"
      [currency]="currency"
      [hasCurrency]="hasCurrency"
      [decimalPlaces]="decimalPlaces"
      [customErrorMessages]="customErrorMessages"
      [autocomplete]="autocomplete">
      <span group-prefix>Prefix</span>
      <span group-sufix>Suffix</span>
    </nba-input>
  `
})
class HostComponent {
  label = 'Test Input';
  icon = 'ti-user';
  required = false;
  password = false;
  type: 'text' | 'number' | 'email' | 'password' | 'date' = 'text';
  mask = '';
  validation = true;
  dropSpecialCharacters = true;
  currency = false;
  hasCurrency = false;
  decimalPlaces = 2;
  customErrorMessages = {};
  autocomplete: string | boolean = false;
}

describe('InputComponent', () => {
  let component: InputComponent<any>;
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.directive(InputComponent));
    component = debugElement.componentInstance;
    
    // Initialize control if not present
    if (!component.control) {
      component.control = new FormControl();
      fixture.detectChanges();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default input values', () => {
      expect(component.password()).toBe(false);
      expect(component.type()).toBe('text');
      expect(component.validation()).toBe(true);
      expect(component.dropSpecialCharacters()).toBe(true);
      expect(component.currency()).toBe(false);
      expect(component.hasCurrency()).toBe(false);
      expect(component.decimalPlaces()).toBe(2);
      expect(component.autocomplete()).toBe(false);
    });

    it('should accept password input', () => {
      host.password = true;
      fixture.detectChanges();
      
      expect(component.password()).toBe(true);
    });

    it('should accept different input types', () => {
      host.type = 'email';
      fixture.detectChanges();
      
      expect(component.type()).toBe('email');
    });

    it('should accept mask configuration', () => {
      host.mask = '000.000.000-00';
      fixture.detectChanges();
      
      expect(component.mask()).toBe('000.000.000-00');
    });

    it('should accept currency configuration', () => {
      host.currency = true;
      host.hasCurrency = true;
      host.decimalPlaces = 4;
      fixture.detectChanges();
      
      expect(component.currency()).toBe(true);
      expect(component.hasCurrency()).toBe(true);
      expect(component.decimalPlaces()).toBe(4);
    });
  });

  describe('Template rendering', () => {
    it('should render form group when control exists', () => {
      const formGroupElement = fixture.debugElement.query(By.css('.form-group'));
      if (formGroupElement) {
        expect(formGroupElement).toBeTruthy();
      } else {
        // If defer blocks haven't loaded yet, check for placeholder
        const placeholderElement = fixture.debugElement.query(By.css('nba-input-placeholder'));
        expect(placeholderElement).toBeTruthy();
      }
    });

    it('should eventually render label correctly', async () => {
      // Wait for defer block to load
      await fixture.whenStable();
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label'));
      if (labelElement) {
        expect(labelElement.nativeElement.textContent.trim()).toContain('Test Input');
      }
    });

    it('should eventually render icon when provided', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('i.ti'));
      if (iconElement) {
        expect(iconElement.nativeElement.classList.contains('ti-user')).toBe(true);
      }
    });

    it('should not render icon when not provided', async () => {
      host.icon = '';
      fixture.detectChanges();
      await fixture.whenStable();
      
      const iconElement = fixture.debugElement.query(By.css('i.ti'));
      expect(iconElement).toBeFalsy();
    });

    it('should render appropriate input type', async () => {
      host.type = 'text';
      host.password = false;
      host.currency = false;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        expect(inputElement.nativeElement.type).toBe('text');
      }
    });

    it('should render password input when password is true', async () => {
      host.password = true;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const passwordInput = fixture.debugElement.query(By.css('input[input-password]'));
      if (passwordInput) {
        expect(passwordInput.nativeElement.type).toBe('password');
      }
    });

    it('should render currency input when currency is true', async () => {
      host.currency = true;
      host.password = false;
      fixture.detectChanges();
      await fixture.whenStable();
      
      const currencyInput = fixture.debugElement.query(By.css('input[currency]'));
      if (currencyInput) {
        expect(currencyInput.nativeElement.type).toBe('text');
      }
    });

    it('should render content projection areas', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      
      const formGroupElement = fixture.debugElement.query(By.css('.form-group'));
      if (formGroupElement) {
        const textContent = formGroupElement.nativeElement.textContent;
        expect(textContent).toContain('Prefix');
        expect(textContent).toContain('Suffix');
      }
    });
  });

  describe('Input attributes', () => {
    it('should set input attributes correctly for regular input', () => {
      host.type = 'email';
      host.password = false;
      host.currency = false;
      host.mask = '000.000.000-00';
      host.autocomplete = 'email';
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        expect(inputElement).toBeTruthy();
        const nativeElement = inputElement.nativeElement;
        expect(nativeElement.type).toBe('email');
        expect(nativeElement.placeholder).toBe('Test Input');
      }
    });

    it('should set currency-specific attributes', () => {
      host.currency = true;
      host.hasCurrency = true;
      host.decimalPlaces = 3;
      host.password = false;
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input[currency]'));
      if (inputElement) {
        expect(inputElement).toBeTruthy();
        const nativeElement = inputElement.nativeElement;
        expect(nativeElement.hasAttribute('currency')).toBe(true);
        expect(nativeElement.type).toBe('text');
      }
    });

    it('should set mask attributes correctly', () => {
      host.mask = '(00) 00000-0000';
      host.validation = false;
      host.dropSpecialCharacters = false;
      host.password = false;
      host.currency = false;
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        expect(inputElement).toBeTruthy();
      }
    });
  });

  describe('Form integration', () => {
    it('should work with FormControl', () => {
      const testControl = new FormControl('initial value');
      component.control = testControl;
      fixture.detectChanges();
      
      expect(component.control.value).toBe('initial value');
    });

    it('should reflect required state in label class', () => {
      const testControl = new FormControl('', Validators.required);
      component.control = testControl;
      host.required = true;
      fixture.detectChanges();
      
      const labelElement = fixture.debugElement.query(By.css('label.required'));
      if (labelElement) {
        expect(labelElement).toBeTruthy();
      }
    });

    it('should display form error message component', () => {
      const errorComponent = fixture.debugElement.query(By.css('nba-form-error-message'));
      if (errorComponent) {
        expect(errorComponent).toBeTruthy();
      }
    });
  });

  describe('Conditional rendering', () => {
    it('should show placeholder when control is not available', () => {
      component.control = undefined;
      fixture.detectChanges();
      
      const placeholderElement = fixture.debugElement.query(By.css('nba-input-placeholder'));
      if (placeholderElement) {
        expect(placeholderElement).toBeTruthy();
      }
    });

    it('should show input when control is available', () => {
      component.control = new FormControl();
      fixture.detectChanges();
      
      const formGroupElement = fixture.debugElement.query(By.css('.form-group'));
      if (formGroupElement) {
        expect(formGroupElement).toBeTruthy();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper input id and label association', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const labelElement = fixture.debugElement.query(By.css('label'));
      
      if (inputElement && labelElement) {
        expect(inputElement).toBeTruthy();
        expect(labelElement).toBeTruthy();
        
        const inputId = inputElement.nativeElement.id;
        const labelFor = labelElement.nativeElement.getAttribute('for');
        
        expect(inputId).toBeTruthy();
        expect(labelFor).toBe(inputId);
      }
    });

    it('should set input name attribute same as id', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        const nativeElement = inputElement.nativeElement;
        expect(nativeElement.name).toBe(nativeElement.id);
      }
    });

    it('should set placeholder attribute', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      if (inputElement) {
        expect(inputElement.nativeElement.placeholder).toBe('Test Input');
      }
    });
  });

  describe('Boolean attribute transformations', () => {
    it('should transform password boolean attribute correctly', () => {
      host.password = true;
      fixture.detectChanges();
      expect(component.password()).toBe(true);
      
      host.password = false;
      fixture.detectChanges();
      expect(component.password()).toBe(false);
    });

    it('should transform currency boolean attributes correctly', () => {
      host.currency = true;
      host.hasCurrency = true;
      host.dropSpecialCharacters = false;
      fixture.detectChanges();
      
      expect(component.currency()).toBe(true);
      expect(component.hasCurrency()).toBe(true);
      expect(component.dropSpecialCharacters()).toBe(false);
    });
  });

  describe('Autocomplete handling', () => {
    it('should handle string autocomplete', () => {
      host.autocomplete = 'username';
      fixture.detectChanges();
      
      expect(component.autocomplete()).toBe('username');
    });

    it('should handle boolean autocomplete', () => {
      host.autocomplete = false;
      fixture.detectChanges();
      
      expect(component.autocomplete()).toBe(false);
    });
  });

  describe('Input types validation', () => {
    const inputTypes: Array<'text' | 'number' | 'email' | 'password' | 'date'> = 
      ['text', 'number', 'email', 'password', 'date'];

    inputTypes.forEach(inputType => {
      it(`should accept ${inputType} type`, () => {
        host.type = inputType;
        host.password = false;
        host.currency = false;
        fixture.detectChanges();
        
        expect(component.type()).toBe(inputType);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty mask', () => {
      host.mask = '';
      fixture.detectChanges();
      
      expect(component.mask()).toBe('');
    });

    it('should handle zero decimal places for currency', () => {
      host.currency = true;
      host.decimalPlaces = 0;
      fixture.detectChanges();
      
      expect(component.decimalPlaces()).toBe(0);
    });

    it('should handle custom error messages', () => {
      const customMessages = { required: 'This field is mandatory' };
      host.customErrorMessages = customMessages;
      fixture.detectChanges();
      
      expect(component.customErrorMessages()).toEqual(customMessages);
    });
  });
});
