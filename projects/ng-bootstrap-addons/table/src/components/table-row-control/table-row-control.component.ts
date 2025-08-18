// table-row-control.component.ts
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, TemplateRef, viewChild } from '@angular/core';
import { TableComponent } from '../../table.component';
import { FormsModule } from '@angular/forms';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'tr[nbaControl]',
  imports: [FormsModule, ContextMenuComponent],
  styleUrl: './table-row-control.component.scss',
  templateUrl: './table-row-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableRowControlComponent<T = any> {

  private table = inject(TableComponent<T>);

  value = input<T | null>(null);
  clickDelay = input<number>(220);

  selected = output<boolean>();
  rowClick = output<void>();
  rowDoubleClick = output<void>();
  menuClosed = output<void>();
  menuItemClicked = output<HTMLElement>();

  multiple = computed(() => this.table.multiple());
  isSelected = computed(() => {
    if (!this.value()) return false;
    return this.table.selectedRows().includes(this.value()!);
  });

  menuTemplate = viewChild<TemplateRef<any>>('contextMenuTemplate');
  contextMenu = viewChild<ContextMenuComponent>('contextMenu');

  private clickTimer: any = null;

  constructor(){
    effect(() => {
      this.selected.emit(this.isSelected());
    });
  }

  onClick(){
    if(this.clickTimer){
      clearTimeout(this.clickTimer);
      this.rowDoubleClick.emit();
      return;
    }
    this.clickTimer = setTimeout(() => {
      if(this.value()) this.table.selectRow(this.value()!);
      this.clickTimer = null;
      this.rowClick.emit();
    }, this.clickDelay());
  }

  onCheckboxChange(newValue: boolean) {
    if (newValue && this.value()) return this.table.selectRow(this.value()!);
  }

  onRightClick(event: MouseEvent) {
    const menu = this.contextMenu();
    const template = this.menuTemplate();
    
    if (menu && template) {
      menu.show(event);
    }
  }

  onMenuClosed() {
    this.menuClosed.emit();
  }

  onMenuItemClicked(item: HTMLElement) {
    this.menuItemClicked.emit(item);
  }
}