import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
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
export class ContextMenuComponent implements AfterViewInit {
  private renderer = inject(Renderer2);
  private host = inject(ElementRef<HTMLElement>);

  @ViewChild('menuContainer') menuContainer?: ElementRef<HTMLElement>;

  menuTemplate = input.required<TemplateRef<any>>();
  autoClose = input<boolean>(true);
  closeOnInsideClick = input<boolean>(true);

  menuClosed = output<void>();
  itemClicked = output<any>();

  isVisible = signal<boolean>(false);
  position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  ngAfterViewInit() {
    const hostEl = this.host.nativeElement;
    this.renderer.appendChild(document.body, hostEl);
  }

  show(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isVisible.set(true);

    const initial = {
      x: event.clientX,
      y: event.clientY
    };

    this.position.set(initial);

    queueMicrotask(() => {
      this.reposition(initial.x, initial.y);
    });
  }

  hide() {
    if (!this.isVisible()) return;
    this.isVisible.set(false);
    this.menuClosed.emit();
  }

  private reposition(x: number, y: number) {
    const menuEl = this.menuContainer?.nativeElement;
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

  onMenuClick(event: Event) {
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

    const menuEl = this.menuContainer?.nativeElement;
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