// context-menu.component.ts
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output, Renderer2, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nba-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {

  //Inputs
  menuTemplate = input.required<TemplateRef<any>>();
  autoClose = input<boolean>(true);
  closeOnInsideClick = input<boolean>(true);
  
  //Outputs
  menuClosed = output<void>();
  itemClicked = output<any>();

  //Signals para estado
  isVisible = signal<boolean>(false);
  position = signal<{x: number, y: number}>({x: 0, y: 0});

  //Mostrar menu na posição do mouse
  show(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const position = this.calculatePosition(event);
    this.position.set(position);
    this.isVisible.set(true);
  }

  //Esconder menu
  hide() {
    this.isVisible.set(false);
    this.menuClosed.emit();
  }

  //Calcular posição considerando bordas da tela
  private calculatePosition(event: MouseEvent): {x: number, y: number} {
    let x = event.clientX;
    let y = event.clientY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const menuWidth = 200; // Largura estimada
    const menuHeight = 200; // Altura estimada

    // Ajustar X se sair da tela pela direita
    if (x + menuWidth > screenWidth) {
      x = Math.max(10, x - menuWidth);
    }

    // Ajustar Y se sair da tela por baixo
    if (y + menuHeight > screenHeight) {
      y = Math.max(10, y - menuHeight);
    }

    // Garantir que não saia da tela
    x = Math.max(10, Math.min(x, screenWidth - menuWidth));
    y = Math.max(10, Math.min(y, screenHeight - menuHeight));

    return {x, y};
  }

  // Tratar clique no menu
  onMenuClick(event: Event) {
    if (this.closeOnInsideClick()) {
      const target = event.target as HTMLElement;
      
      // Fechar se clicar em um item (não no divider)
      if (target.classList.contains('dropdown-item') && !target.classList.contains('disabled')) {
        this.itemClicked.emit(target);
        this.hide();
      }
    }
  }

  //Fechar com ESC
  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isVisible()) {
      this.hide();
    }
  }
}