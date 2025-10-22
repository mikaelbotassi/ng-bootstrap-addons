// table-row-control.component.ts
import { AfterViewInit, booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, Host, HostBinding, HostListener, inject, input, model, output, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { TableComponent } from '../../table.component';
import { FormsModule } from '@angular/forms';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@Component({
  selector: 'tr[nbaControl]',
  imports: [FormsModule, ContextMenuComponent, CollapseModule],
  styleUrl: './table-row-control.component.scss',
  templateUrl: './table-row-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableRowControlComponent<T = any> implements AfterViewInit {

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
  collapseTemplate = viewChild<TemplateRef<any>>('collapseTemplate');

  expandable = input(false, { transform: booleanAttribute });
  expanded = model(false);

  showMenu = input(true, { transform: booleanAttribute });
  disableClick = input(false, { transform: booleanAttribute });
  disableDoubleClick = input(false, { transform: booleanAttribute });
  clickDisabled = computed(() => this.disableClick() && this.disableDoubleClick() && !this.showMenu());

  @HostBinding('class.disabled') 
  get isDisabled() {
    return this.clickDisabled();
  }
  
  @HostBinding('class.active') 
  get isActive() {
    return !this.clickDisabled() && this.isSelected();
  }

  allRowSelectable = computed(() => {
    if(this.expandable()) return false;
    return true;
  });

  private clickTimer: any = null;

  constructor(private viewRef: ViewContainerRef){
    effect(() => {
      this.selected.emit(this.isSelected());
    });
  }

  ngAfterViewInit() {
    if (this.expandable()) {
      this.insertCollapseRow();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent){
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('no-clickable') || target.closest('.no-clickable')) {
      return;
    }
    if(this.expandable()){
      this.expanded.set(!this.expanded());
      return;
    }

    if(this.clickTimer){
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      if(this.disableDoubleClick()) return;
      this.rowDoubleClick.emit();
      return;
    }
    this.clickTimer = setTimeout(() => {
      this.clickTimer = null;
      if(this.clickDisabled()) return;
      if(this.value()) this.table.selectRow(this.value()!);
      this.rowClick.emit();
    }, this.clickDelay());
  }

  onCheckboxChange(checked: boolean) {
    if (checked && this.value()) return this.table.selectRow(this.value()!);
    return this.table.deselectRow(this.value()!);
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    if(!this.showMenu() || this.expandable()) return;
    event.preventDefault();
    event.stopPropagation();
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

  toggleExpansion(event: Event) {
    event.stopPropagation();
    this.expanded.update(value => !value);
  }

  private insertCollapseRow() {
    const currentRow = this.viewRef.element.nativeElement.closest('tr');
    
    if (currentRow && this.collapseTemplate()) {
      const collapseRowElement = this.viewRef.createEmbeddedView(this.collapseTemplate()!).rootNodes[0];
      
      currentRow.parentNode?.insertBefore(collapseRowElement, currentRow.nextSibling);
    }
  }
  
  getColspan(): number {
    const contentCells = this.viewRef.element.nativeElement.querySelectorAll('td').length;
    return contentCells;
  }

}