import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ControlValueAccessorDirective } from 'directives/control-value-acessor.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ControlValueAccessorDirective],
  template: `
    <input
      [formControl]="control"
      appControlValueAccessor
      [required]="true"
      [label]="'Label'"
      [icon]="'icon-name'"
    />
  `
})
class TestHostComponent {
  control = new FormControl('');
}

describe('ControlValueAccessorDirective (standalone)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let directiveInstance: ControlValueAccessorDirective<any>;
  let debugElement: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.directive(ControlValueAccessorDirective));
    directiveInstance = debugElement.injector.get(ControlValueAccessorDirective);
  });

  it('should create an instance', () => {
    expect(directiveInstance).toBeTruthy();
  });

  it('should setDisabledState updates _isDisabled', () => {
    directiveInstance.setDisabledState!(true);
    expect((directiveInstance as any)._isDisabled).toBeTrue();

    directiveInstance.setDisabledState!(false);
    expect((directiveInstance as any)._isDisabled).toBeFalse();
  });

  it('should write value to the control', () => {
    directiveInstance.writeValue('Test Value');
    expect(component.control.value).toBe('Test Value');
  });

  it('should register onTouched', () => {
    const fn = jasmine.createSpy('onTouched');
    directiveInstance.registerOnTouched(fn);
    (directiveInstance as any)._onTouched();

    debugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(fn).toHaveBeenCalled();
  });

  it('should register onChange and emit when value changes', () => {
    const fn = jasmine.createSpy('onChange');
    directiveInstance.registerOnChange(fn);

    component.control.setValue('New Value');
    fixture.detectChanges();

    expect(fn).toHaveBeenCalledWith('New Value');
  });

  it('should add Validators.required if required input is true', () => {
    directiveInstance.ngOnInit();
    expect(component.control.validator).toBeTruthy();
    const errors = component.control.validator!(component.control);
    expect(errors?.['required']).toBeTrue();
  });
});