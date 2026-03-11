import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewChild,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nba-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
  private renderer = inject(Renderer2);
  private host = inject(ElementRef<HTMLElement>);

  @ViewChild('menuRef') menuRef?: ElementRef<HTMLUListElement>;

  menuTemplate = input.required<TemplateRef<any>>();
  autoClose = input<boolean>(true);
  closeOnInsideClick = input<boolean>(true);

  menuClosed = output<void>();
  itemClicked = output<any>();

  isVisible = signal(false);
  zIndex = signal(2000);
  position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  ngAfterViewInit() {
    this.renderer.appendChild(document.body, this.host.nativeElement);
  }

  ngOnDestroy() {
    const hostEl = this.host.nativeElement;
    if (hostEl.parentNode) {
      hostEl.parentNode.removeChild(hostEl);
    }
  }

  show(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.zIndex.set(this.getHighestZIndex() + 1);

    const initial = {
      x: event.clientX,
      y: event.clientY
    };

    this.position.set(initial);
    this.isVisible.set(true);

    requestAnimationFrame(() => {
      this.reposition(initial.x, initial.y);
    });
  }

  hide() {
    if (!this.isVisible()) return;
    this.isVisible.set(false);
    this.menuClosed.emit();
  }

  private reposition(x: number, y: number) {
    const menuEl = this.menuRef?.nativeElement;
    if (!menuEl) return;

    const rect = menuEl.getBoundingClientRect();
    const margin = 8;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let finalX = x;
    let finalY = y;

    if (finalX + rect.width > screenWidth - margin) {
      finalX = screenWidth - rect.width - margin;
    }

    if (finalY + rect.height > screenHeight - margin) {
      finalY = screenHeight - rect.height - margin;
    }

    finalX = Math.max(margin, finalX);
    finalY = Math.max(margin, finalY);

    this.position.set({ x: finalX, y: finalY });
  }

  private getHighestZIndex(): number {
    let max = 0;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('body *'));

    for (const el of elements) {
      const style = window.getComputedStyle(el);
      const zIndex = style.zIndex;

      if (zIndex === 'auto') continue;

      const parsed = Number(zIndex);
      if (!Number.isNaN(parsed)) {
        max = Math.max(max, parsed);
      }
    }

    return max;
  }

  onMenuClick(event: Event) {
    event.stopPropagation();

    if (!this.closeOnInsideClick()) return;

    const target = event.target as HTMLElement;
    const item = target.closest('.dropdown-item') as HTMLElement | null;

    if (item && !item.classList.contains('disabled')) {
      this.itemClicked.emit(item);
      this.hide();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.autoClose() || !this.isVisible()) return;

    const menuEl = this.menuRef?.nativeElement;
    const target = event.target as Node;

    if (menuEl && !menuEl.contains(target)) {
      this.hide();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isVisible()) {
      this.hide();
    }
  }
}