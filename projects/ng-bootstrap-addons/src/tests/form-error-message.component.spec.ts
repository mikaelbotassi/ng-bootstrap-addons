import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormErrorMessageComponent } from 'form-error-message/form-error-message.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidatorService } from 'services/custom-validator.service';
import { Subject } from 'rxjs';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent],
      providers: [CustomValidatorService]
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    mockComponent = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(FormErrorMessageComponent)).componentInstance;
    
    expect(component).toBeTruthy();
  });

  it('should display initial error message when control invalid', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();

    mockComponent.control = control;
    fixture.detectChanges();
    
    component = fixture.debugElement.query(By.directive(FormErrorMessageComponent)).componentInstance;

    // The real service should return the default required message
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
    
    component = fixture.debugElement.query(By.directive(FormErrorMessageComponent)).componentInstance;

    expect(component.message).toBeNull();

    const div = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(div).toBeNull();
  });

  it('should update message when control status changes', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();

    mockComponent.control = control;
    fixture.detectChanges();
    
    component = fixture.debugElement.query(By.directive(FormErrorMessageComponent)).componentInstance;

    // Initially should show required message
    expect(component.message).toBe('Este campo é obrigatório');

    // Make control valid
    control.setValue('valid value');
    fixture.detectChanges();

    expect(component.message).toBeNull();

    // Make control invalid again
    control.setValue('');
    fixture.detectChanges();

    expect(component.message).toBe('Este campo é obrigatório');
  });

  it('should not render feedback div when control untouched', () => {
    const control = new FormControl('', Validators.required);
    // Not marking as touched

    mockComponent.control = control;
    fixture.detectChanges();
    
    component = fixture.debugElement.query(By.directive(FormErrorMessageComponent)).componentInstance;

    // Message should exist but div should not be rendered due to untouched state
    expect(component.message).toBe('Este campo é obrigatório');
    
    // The div should not be rendered because control is untouched
    const div = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(div).toBeNull();
  });
});