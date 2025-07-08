import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyDirective } from 'ng-bootstrap-addons/directives';
import { NumericPipe } from 'ng-bootstrap-addons/pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CurrencyDirective],
  template: `
    <input currency [hasCurrency]="true" [decimalPlaces]="2" />
  `
})
class TestHostComponent {}

describe('CurrencyDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;
  let directive: CurrencyDirective;
  let numericPipe: jasmine.SpyObj<NumericPipe>;

  beforeEach(() => {
    
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [NumericPipe]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(CurrencyDirective));
    directive = debugEl.injector.get(CurrencyDirective);
    inputEl = debugEl.nativeElement as HTMLInputElement;
    numericPipe = debugEl.injector.get(NumericPipe) as jasmine.SpyObj<NumericPipe>;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should write value and format with NumericPipe', () => {
    const spy = spyOn(numericPipe, 'transform').and.callThrough();
    directive.writeValue(1.23);
    expect(numericPipe.transform).toHaveBeenCalledWith(1.23, true, 2);
    expect(inputEl.value).toBe('R$ 1,23');
  });

  it('should disable and enable the input', () => {
    directive.setDisabledState(true);
    expect(inputEl.disabled).toBeTrue();

    directive.setDisabledState(false);
    expect(inputEl.disabled).toBeFalse();
  });

  it('should call onTouched when blurred', () => {
    const fn = jasmine.createSpy('onTouched');
    directive.registerOnTouched(fn);

    inputEl.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(fn).toHaveBeenCalled();
  });

  it('should handle keydown for digit input', () => {
    const changeFn = jasmine.createSpy('onChange');
    directive.registerOnChange(changeFn);

    inputEl.value = '1';
    const event = new KeyboardEvent('keydown', { key: '2' });
    directive.onKeyDown(event);

    expect(inputEl.value).toBe('R$ 0,12');
    expect(changeFn).toHaveBeenCalled();
  });

  it('should handle keydown for backspace', () => {
    const changeFn = jasmine.createSpy('onChange');
    directive.registerOnChange(changeFn);

    inputEl.value = '12';
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    directive.onKeyDown(event);

    expect(changeFn).toHaveBeenCalled();
  });

  it('should handle keydown for delete', () => {
    const changeFn = jasmine.createSpy('onChange');
    directive.registerOnChange(changeFn);

    inputEl.value = '123';
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    directive.onKeyDown(event);

    expect(changeFn).toHaveBeenCalledWith(0);
    expect(inputEl.value).toBe('');
  });

  it('should not prevent Tab keydown', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const prevent = spyOn(event, 'preventDefault');

    directive.onKeyDown(event);
    expect(prevent).not.toHaveBeenCalled();
  });

  it('should prevent non-digit keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' });
    const prevent = spyOn(event, 'preventDefault');

    directive.onKeyDown(event);
    expect(prevent).toHaveBeenCalled();
  });
});
