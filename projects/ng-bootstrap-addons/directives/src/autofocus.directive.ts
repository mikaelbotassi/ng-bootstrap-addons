import { Directive, ElementRef, input } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {

  autofocus = input(false);

  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    if (this.autofocus()) {
      this.host.nativeElement.focus();
    }
  }
}