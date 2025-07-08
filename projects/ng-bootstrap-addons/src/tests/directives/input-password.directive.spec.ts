import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InputPasswordDirective } from 'directives/input-password.directive';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [InputPasswordDirective],
  template: `
    <div>
      <input type="password" input-password />
    </div>
  `
})
class TestHostComponent {}

describe('InputPasswordDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;
  let directive: InputPasswordDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.autoDetectChanges();

    const debugEl = fixture.debugElement.query(By.directive(InputPasswordDirective));
    directive = debugEl.injector.get(InputPasswordDirective);
    inputEl = debugEl.nativeElement as HTMLInputElement;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should create and append eye icon on init', () => {
    const eyeIcon = directive['eyeIcon'];
    expect(eyeIcon).toBeTruthy();
    expect(eyeIcon.classList).toContain('password-eye-icon');
    expect(eyeIcon.classList).toContain('ti-eye');
    expect(eyeIcon.parentNode).toBe(inputEl.parentNode);
  });

  it('should show eye icon on focus', () => {
    const eyeIcon = directive['eyeIcon'];
    spyOn(directive['renderer'], 'setStyle');

    inputEl.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(directive['renderer'].setStyle).toHaveBeenCalledWith(eyeIcon, 'display', 'block');
  });

  it('should hide eye icon on blur if not showing password', fakeAsync(() => {
    const eyeIcon = directive['eyeIcon'];
    spyOn(directive['renderer'], 'setStyle');

    inputEl.dispatchEvent(new FocusEvent('blur'));
    tick(200);
    fixture.detectChanges();

    expect(directive['renderer'].setStyle).toHaveBeenCalledWith(eyeIcon, 'display', 'none');
  }));

  it('should toggle password visibility and icon classes on mousedown', () => {
    const eyeIcon = directive['eyeIcon'];
    const event = new MouseEvent('mousedown');
    const setAttributeSpy = spyOn(directive['renderer'], 'setAttribute').and.callThrough();
    const addClassSpy = spyOn(directive['renderer'], 'addClass').and.callThrough();
    const removeClassSpy = spyOn(directive['renderer'], 'removeClass').and.callThrough();

    // Initially, showPassword = false
    directive['togglePasswordVisibility'](event);

    // expect(event.defaultPrevented).toBeTrue();
    expect(directive['showPassword']).toBeTrue();
    expect(setAttributeSpy).toHaveBeenCalledWith(inputEl, 'type', 'text');
    expect(removeClassSpy).toHaveBeenCalledWith(eyeIcon, 'ti-eye');
    expect(addClassSpy).toHaveBeenCalledWith(eyeIcon, 'ti-eye-off');

    // Toggle again
    directive['togglePasswordVisibility'](event);

    expect(directive['showPassword']).toBeFalse();
    expect(setAttributeSpy).toHaveBeenCalledWith(inputEl, 'type', 'password');
    expect(removeClassSpy).toHaveBeenCalledWith(eyeIcon, 'ti-eye-off');
    expect(addClassSpy).toHaveBeenCalledWith(eyeIcon, 'ti-eye');
  });
});