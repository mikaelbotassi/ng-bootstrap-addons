import { Directive, ElementRef, EventEmitter, HostListener, input, Input, Output } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  exceptClass = input<string>();
  @Output() onClickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const clickedOutsideHost = !this.el.nativeElement.contains(target);
    const clickedOutsideClass = this.exceptClass() ? !target.closest('.' + this.exceptClass()) : true;

    if (clickedOutsideHost && clickedOutsideClass) {
      this.onClickOutside.emit();
    }
  }
}
