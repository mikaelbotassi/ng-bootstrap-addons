import { Directive, input, output, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[mouseClick]'
})
export class MouseClickDirective implements OnDestroy {

  singleClick = output<MouseEvent>();
  doubleClick = output<MouseEvent>();
  rightClick = output<MouseEvent>();
  dragStart = output<MouseEvent>();
  dragEnd = output<MouseEvent>();

  clickInterval = input<number>(250); // Default 250ms para detectar double click
  private clickTimeout: any;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const interval = this.clickInterval();
    
    if (interval && interval > 0) {
      if (this.clickTimeout) {
        // Double click detectado
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
        this.doubleClick.emit(event);
      } else {
        // Aguarda para ver se há um segundo click
        this.clickTimeout = setTimeout(() => {
          this.singleClick.emit(event);
          this.clickTimeout = null;
        }, interval);
      }
    } else {
      // Sem delay, emite single click imediatamente
      this.singleClick.emit(event);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.rightClick.emit(event);
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent) {
    // Fallback para navegadores que suportam dblclick nativo
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    this.doubleClick.emit(event);
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: MouseEvent) {
    this.dragStart.emit(event);
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: MouseEvent) {
    this.dragEnd.emit(event);
  }

  ngOnDestroy() {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
  }
}