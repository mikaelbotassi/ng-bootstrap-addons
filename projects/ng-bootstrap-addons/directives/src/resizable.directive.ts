import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

export type NbaResizeHandle =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface NbaResizeEvent {
  width: number;
  height: number;
  element: HTMLElement;
}

@Directive({
  selector: '[nbaResizable]',
})
export class ResizableDirective implements AfterViewInit, OnDestroy {
  readonly resizeDisabled = input(false, { transform: booleanAttribute });

  readonly resizeMinWidth = input(120);
  readonly resizeMaxWidth = input(Number.MAX_SAFE_INTEGER);
  readonly resizeMinHeight = input(80);
  readonly resizeMaxHeight = input(Number.MAX_SAFE_INTEGER);

  readonly resizeHandleSize = input(12);
  readonly resizeShowHandles = input(true, { transform: booleanAttribute });

  readonly resizeHandles = input<NbaResizeHandle[]>([
    'left',
    'right',
    'top',
    'bottom',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ]);

  readonly resizeStarted = output<NbaResizeEvent>();
  readonly resized = output<NbaResizeEvent>();
  readonly resizeEnded = output<NbaResizeEvent>();

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  private readonly viewReady = signal(false);

  private handleElements: HTMLElement[] = [];
  private handleListeners: Array<() => void> = [];
  private documentListeners: Array<() => void> = [];

  private isResizing = false;
  private activeHandle: NbaResizeHandle | null = null;

  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private startLeft = 0;
  private startTop = 0;

  ngAfterViewInit(): void {
    this.prepareHost();
    this.viewReady.set(true);
  }

  ngOnDestroy(): void {
    this.stopResizing();
    this.destroyHandles();
  }

  private get host(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  private prepareHost(): void {
    const style = getComputedStyle(this.host);

    if (style.position === 'static') {
      this.renderer.setStyle(this.host, 'position', 'relative');
    }

    this.renderer.setStyle(this.host, 'box-sizing', 'border-box');
    this.refreshHandles();
  }

  private refreshHandles(): void {
    this.destroyHandles();

    if (this.resizeDisabled()) return;

    for (const handle of this.resizeHandles()) {
      this.createHandle(handle);
    }
  }

  private createHandle(handleType: NbaResizeHandle): void {
    const handle = this.renderer.createElement('div') as HTMLElement;
    const size = Math.max(10, this.resizeHandleSize());

    this.renderer.setAttribute(handle, 'data-resize-handle', handleType);
    this.renderer.setStyle(handle, 'position', 'absolute');
    this.renderer.setStyle(handle, 'z-index', '5');
    this.renderer.setStyle(handle, 'user-select', 'none');
    this.renderer.setStyle(handle, 'touch-action', 'none');
    this.renderer.setStyle(handle, 'background', 'transparent');

    switch (handleType) {
      case 'left':
        this.setStyles(handle, {
          left: '0',
          top: '0',
          width: `${size}px`,
          height: '100%',
          cursor: 'ew-resize',
        });
        break;

      case 'right':
        this.setStyles(handle, {
          right: '0',
          top: '0',
          width: `${size}px`,
          height: '100%',
          cursor: 'ew-resize',
        });
        break;

      case 'top':
        this.setStyles(handle, {
          left: '0',
          top: '0',
          width: '100%',
          height: `${size}px`,
          cursor: 'ns-resize',
        });
        break;

      case 'bottom':
        this.setStyles(handle, {
          left: '0',
          bottom: '0',
          width: '100%',
          height: `${size}px`,
          cursor: 'ns-resize',
        });
        break;

      case 'top-left':
        this.setStyles(handle, {
          left: '0',
          top: '0',
          width: `${size + 4}px`,
          height: `${size + 4}px`,
          cursor: 'nwse-resize',
        });
        break;

      case 'top-right':
        this.setStyles(handle, {
          right: '0',
          top: '0',
          width: `${size + 4}px`,
          height: `${size + 4}px`,
          cursor: 'nesw-resize',
        });
        break;

      case 'bottom-left':
        this.setStyles(handle, {
          left: '0',
          bottom: '0',
          width: `${size + 4}px`,
          height: `${size + 4}px`,
          cursor: 'nesw-resize',
        });
        break;

      case 'bottom-right':
        this.setStyles(handle, {
          right: '0',
          bottom: '0',
          width: `${size + 4}px`,
          height: `${size + 4}px`,
          cursor: 'nwse-resize',
        });
        break;
    }

    if (this.resizeShowHandles() && handleType.includes('-')) {
      this.renderer.setStyle(handle, 'outline', '1px dashed rgba(0,0,0,.15)');
      this.renderer.setStyle(handle, 'outline-offset', '-1px');
    }

    const cleanup = this.renderer.listen(handle, 'pointerdown', (event: PointerEvent) => {
      this.onPointerDown(event, handleType);
    });

    this.handleElements.push(handle);
    this.handleListeners.push(cleanup);
    this.renderer.appendChild(this.host, handle);
  }

  private onPointerDown(event: PointerEvent, handleType: NbaResizeHandle): void {
    if (this.resizeDisabled()) return;

    event.preventDefault();
    event.stopPropagation();

    const rect = this.host.getBoundingClientRect();
    const computedStyle = getComputedStyle(this.host);

    this.isResizing = true;
    this.activeHandle = handleType;

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = rect.width;
    this.startHeight = rect.height;
    this.startLeft = this.parsePx(computedStyle.left);
    this.startTop = this.parsePx(computedStyle.top);

    this.renderer.setStyle(document.body, 'user-select', 'none');
    this.renderer.setStyle(document.body, 'cursor', this.getCursor(handleType));

    this.bindDocumentListeners();

    this.resizeStarted.emit(this.buildEvent());
  }

  private bindDocumentListeners(): void {
    this.clearDocumentListeners();

    this.documentListeners.push(
      this.renderer.listen('document', 'pointermove', (event: PointerEvent) => {
        this.onPointerMove(event);
      })
    );

    this.documentListeners.push(
      this.renderer.listen('document', 'pointerup', () => {
        this.stopResizing(true);
      })
    );

    this.documentListeners.push(
      this.renderer.listen('window', 'blur', () => {
        this.stopResizing(true);
      })
    );
  }

  private onPointerMove(event: PointerEvent): void {
    if (!this.isResizing || !this.activeHandle) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    let nextWidth = this.startWidth;
    let nextHeight = this.startHeight;
    let nextLeft = this.startLeft;
    let nextTop = this.startTop;

    const fromLeft = this.activeHandle === 'left' || this.activeHandle === 'top-left' || this.activeHandle === 'bottom-left';
    const fromRight = this.activeHandle === 'right' || this.activeHandle === 'top-right' || this.activeHandle === 'bottom-right';
    const fromTop = this.activeHandle === 'top' || this.activeHandle === 'top-left' || this.activeHandle === 'top-right';
    const fromBottom = this.activeHandle === 'bottom' || this.activeHandle === 'bottom-left' || this.activeHandle === 'bottom-right';

    if (fromRight) {
      nextWidth = this.clamp(this.startWidth + dx, this.resizeMinWidth(), this.resizeMaxWidth());
    }

    if (fromBottom) {
      nextHeight = this.clamp(this.startHeight + dy, this.resizeMinHeight(), this.resizeMaxHeight());
    }

    if (fromLeft) {
      const rawWidth = this.startWidth - dx;
      nextWidth = this.clamp(rawWidth, this.resizeMinWidth(), this.resizeMaxWidth());
      const consumedDx = this.startWidth - nextWidth;
      nextLeft = this.startLeft + consumedDx;
    }

    if (fromTop) {
      const rawHeight = this.startHeight - dy;
      nextHeight = this.clamp(rawHeight, this.resizeMinHeight(), this.resizeMaxHeight());
      const consumedDy = this.startHeight - nextHeight;
      nextTop = this.startTop + consumedDy;
    }

    this.renderer.setStyle(this.host, 'width', `${nextWidth}px`);
    this.renderer.setStyle(this.host, 'height', `${nextHeight}px`);

    if (fromLeft) {
      this.renderer.setStyle(this.host, 'left', `${nextLeft}px`);
    }

    if (fromTop) {
      this.renderer.setStyle(this.host, 'top', `${nextTop}px`);
    }

    this.resized.emit(this.buildEvent());
  }

  private stopResizing(emitEnd = false): void {
    if (!this.isResizing) {
      this.clearDocumentListeners();
      this.renderer.removeStyle(document.body, 'user-select');
      this.renderer.removeStyle(document.body, 'cursor');
      return;
    }

    this.isResizing = false;
    this.activeHandle = null;

    this.clearDocumentListeners();
    this.renderer.removeStyle(document.body, 'user-select');
    this.renderer.removeStyle(document.body, 'cursor');

    if (emitEnd) {
      this.resizeEnded.emit(this.buildEvent());
    }
  }

  private destroyHandles(): void {
    this.handleListeners.forEach((cleanup) => cleanup());
    this.handleListeners = [];

    this.handleElements.forEach((handle) => {
      if (handle.parentNode) {
        this.renderer.removeChild(this.host, handle);
      }
    });

    this.handleElements = [];
  }

  private clearDocumentListeners(): void {
    this.documentListeners.forEach((cleanup) => cleanup());
    this.documentListeners = [];
  }

  private setStyles(element: HTMLElement, styles: Record<string, string>): void {
    for (const [key, value] of Object.entries(styles)) {
      this.renderer.setStyle(element, key, value);
    }
  }

  private getCursor(handle: NbaResizeHandle): string {
    switch (handle) {
      case 'left':
      case 'right':
        return 'ew-resize';
      case 'top':
      case 'bottom':
        return 'ns-resize';
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize';
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize';
    }
  }

  private parsePx(value: string): number {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private buildEvent(): NbaResizeEvent {
    const rect = this.host.getBoundingClientRect();

    return {
      width: rect.width,
      height: rect.height,
      element: this.host,
    };
  }
}