import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[dragScroll]',
})
export class DragScrollDirective implements OnDestroy {
  private isLocked = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('mousedown', ['$event'])
  async onMouseDown(event: MouseEvent): Promise<void> {
    // botão do meio
    if (event.button !== 1) {
      return;
    }

    event.preventDefault();

    const element = this.el.nativeElement;

    // Fallback: se o browser não suportar Pointer Lock,
    // você pode manter seu comportamento antigo aqui.
    if (!element.requestPointerLock) {
      return;
    }

    try {
      const result = element.requestPointerLock();

      // Alguns browsers retornam Promise, outros não
      if (result instanceof Promise) {
        await result;
      }
    } catch {
      // opcional: tratar erro / fallback
    }
  }

  @HostListener('document:pointerlockchange')
  onPointerLockChange(): void {
    const lockedElement = document.pointerLockElement;
    this.isLocked = lockedElement === this.el.nativeElement;

    if (this.isLocked) {
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
      this.renderer.setStyle(this.el.nativeElement, 'user-select', 'none');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'cursor');
      this.renderer.removeStyle(this.el.nativeElement, 'user-select');
    }
  }

  @HostListener('document:pointerlockerror')
  onPointerLockError(): void {
    this.isLocked = false;
    this.renderer.removeStyle(this.el.nativeElement, 'cursor');
    this.renderer.removeStyle(this.el.nativeElement, 'user-select');
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isLocked) {
      return;
    }

    const host = this.el.nativeElement;

    // "efeito mão arrastando" igual ao seu comportamento atual
    host.scrollLeft -= event.movementX;
    host.scrollTop -= event.movementY;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    // sai do lock ao soltar o botão do meio
    if (this.isLocked && event.button === 1) {
      document.exitPointerLock?.();
    }
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    if (this.isLocked) {
      document.exitPointerLock?.();
    }
  }

  ngOnDestroy(): void {
    if (document.pointerLockElement === this.el.nativeElement) {
      document.exitPointerLock?.();
    }
  }
}