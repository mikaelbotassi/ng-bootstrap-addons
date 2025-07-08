import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormErrorMessageComponent } from 'ng-bootstrap-addons/form-error-message';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidatorService } from 'ng-bootstrap-addons/services';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormErrorMessageComponent],
  template: `
    <input [formControl]="control" />
    <nba-form-error-message [control]="control"></nba-form-error-message>
  `
})
class MockComponent {
  control = new FormControl('', Validators.required);
}

describe('FormErrorMessageComponent', () => {
  let fixture: ComponentFixture<MockComponent>;
  let mockComponent: MockComponent;
  let component: FormErrorMessageComponent;
  let service: CustomValidatorService;

  beforeEach(() => {

    fixture = TestBed.createComponent(MockComponent);
    mockComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(FormErrorMessageComponent)).componentInstance;
    service = TestBed.inject(CustomValidatorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display initial error message when control invalid', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();

    mockComponent.control = control;
    fixture.detectChanges();

    expect(component.message).toBe('Este campo é obrigatório');

    const div = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(div).toBeTruthy();
    expect(div.nativeElement.textContent.trim()).toBe('Este campo é obrigatório');
  });

  it('should not show message when control is valid', () => {
    const control = new FormControl('ok');
    control.markAsTouched();
    mockComponent.control = control;
    fixture.detectChanges();
    spyOn(service, 'getValidatorMessages').and.returnValue(null);

    expect(component.message).toBeNull();

    const div = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(div).toBeNull();
  });

  it('should update message when statusChanges emits', () => {
  const control = new FormControl('', Validators.required);
  control.markAsTouched();

  const statusChanges$ = new Subject<any>();
  (control as any).statusChanges = statusChanges$.asObservable(); // Aqui está a correção

  const spy = spyOn(service, 'getValidatorMessages').and.returnValue(['Initial']);

  mockComponent.control = control;
  fixture.detectChanges();

  expect(component.message).toBe('Initial');

  spy.and.returnValue(['Updated']);
  statusChanges$.next('INVALID');
  fixture.detectChanges();

  expect(component.message).toBe('Updated');

  const div = fixture.debugElement.query(By.css('.invalid-feedback'));
  expect(div.nativeElement.textContent.trim()).toBe('Updated');
});


  it('should not render feedback div when control untouched', () => {
    const control = new FormControl('', Validators.required);
    // Not marking as touched

    spyOn(service, 'getValidatorMessages').and.returnValue(['Required']);

    mockComponent.control = control;
    fixture.detectChanges();

    expect(component.message).toBe('Required');
    const div = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(div).toBeNull();
  });
});