import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from 'directives/click-outside.directive';

@Component({
  standalone: true,
  imports: [ClickOutsideDirective],
  template: `
    <div id="host" clickOutside [exceptClass]="exceptClass" (onClickOutside)="handleOutsideClick()">
      Host Element
    </div>
    <div id="other">Other Element</div>
    <div class="my-except">Except Element</div>
  `
})
class TestHostComponent {
  exceptClass = 'my-except';
  outsideClicks = 0;

  handleOutsideClick() {
    this.outsideClicks++;
  }
}

describe('ClickOutsideDirective (standalone)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let hostElement: HTMLElement;
  let otherElement: HTMLElement;
  let exceptElement: HTMLElement;

  beforeEach(() => {

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    hostElement = fixture.debugElement.query(By.css('#host')).nativeElement;
    otherElement = fixture.debugElement.query(By.css('#other')).nativeElement;
    exceptElement = fixture.debugElement.query(By.css('.my-except')).nativeElement;
  });

  it('should create an instance', () => {
    const directiveEl = fixture.debugElement.query(By.directive(ClickOutsideDirective));
    expect(directiveEl).toBeTruthy();
  });

  it('should emit when clicking outside the host and not matching exceptClass', () => {
    const event = new MouseEvent('click', { bubbles: true });
    otherElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.outsideClicks).toBe(1);
  });

  it('should not emit when clicking inside the host', () => {
    const event = new MouseEvent('click', { bubbles: true });
    hostElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.outsideClicks).toBe(0);
  });

  it('should not emit when clicking an element matching exceptClass', () => {
    const event = new MouseEvent('click', { bubbles: true });
    exceptElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.outsideClicks).toBe(0);
  });

  it('should emit when exceptClass is not set and clicking outside', () => {
    component.exceptClass = '';
    fixture.detectChanges();

    const event = new MouseEvent('click', { bubbles: true });
    otherElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.outsideClicks).toBe(1);
  });
});
