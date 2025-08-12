import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dragScroll]'
})
export class DragScrollDirective {
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;
  private requestId: number | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 1) {
      this.isDragging = true;
      this.startX = event.pageX - this.el.nativeElement.offsetLeft;
      this.startY = event.pageY - this.el.nativeElement.offsetTop;
      this.scrollLeft = this.el.nativeElement.scrollLeft;
      this.scrollTop = this.el.nativeElement.scrollTop;
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
      event.preventDefault();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      if (this.requestId) {
        cancelAnimationFrame(this.requestId);
      }
      this.requestId = requestAnimationFrame(() => this.scroll(event));
    }
  }

  scroll(event: MouseEvent) {
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const y = event.pageY - this.el.nativeElement.offsetTop;
    const walkX = x - this.startX;
    const walkY = y - this.startY;
    this.el.nativeElement.scrollLeft = this.scrollLeft - walkX;
    this.el.nativeElement.scrollTop = this.scrollTop - walkY;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.isDragging && event.button === 1) {
      this.isDragging = false;
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');
      if (this.requestId) {
        cancelAnimationFrame(this.requestId);
        this.requestId = null;
      }
    }
  }

}