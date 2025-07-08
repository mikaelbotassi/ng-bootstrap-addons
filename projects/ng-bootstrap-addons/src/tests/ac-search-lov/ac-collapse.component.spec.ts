import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AutocompleteCollapseComponent } from '../../../inputs/src/ac-search-lov/components/ac-collapse/ac-collapse.component';
import { acMap } from '../../../inputs/src/ac-search-lov/ac-search-lov.component';

@Component({
  standalone: true,
  imports: [AutocompleteCollapseComponent],
  template: `
    <nba-autocomplete-collapse
      [icon]="icon"
      [title]="title"
      [listOfValues]="listOfValues"
      [map]="map"
      [isLoading]="isLoading"
      (onClose)="onClose()"
      (onSelect)="onSelect($event)">
    </nba-autocomplete-collapse>
  `
})
class HostComponent {
  icon = 'ti-search';
  title = 'Test Items';
  listOfValues: any[] = [];
  map: acMap = {
    code: { key: 'id', title: 'ID' },
    desc: { key: 'name', title: 'Name' }
  };
  isLoading = false;
  
  onClose = jasmine.createSpy('onClose');
  onSelect = jasmine.createSpy('onSelect');
}

describe('AutocompleteCollapseComponent', () => {
  let component: AutocompleteCollapseComponent;
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    
    const collapseElement = fixture.debugElement.query(
      (el) => el.componentInstance instanceof AutocompleteCollapseComponent
    );
    component = collapseElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.title()).toBe('Selecione um item');
    expect(component.listOfValues()).toEqual([]);
    expect(component.isLoading()).toBe(false);
    expect(component.itemsLoaded()).toBe(true);
  });

  it('should accept custom icon input', () => {
    host.icon = 'ti-user';
    fixture.detectChanges();
    
    expect(component.icon()).toBe('ti-user');
  });

  it('should accept custom title input', () => {
    host.title = 'Custom Title';
    fixture.detectChanges();
    
    expect(component.title()).toBe('Custom Title');
  });

  it('should accept list of values input', () => {
    const mockValues = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];
    
    host.listOfValues = mockValues;
    fixture.detectChanges();
    
    expect(component.listOfValues()).toEqual(mockValues);
  });

  it('should accept map input', () => {
    const customMap: acMap = {
      code: { key: 'code', title: 'Code' },
      desc: { key: 'description', title: 'Description' }
    };
    
    host.map = customMap;
    fixture.detectChanges();
    
    expect(component.map()).toEqual(customMap);
  });

  it('should handle loading state', () => {
    host.isLoading = true;
    fixture.detectChanges();
    
    expect(component.isLoading()).toBe(true);
    expect(component.itemsLoaded()).toBe(false);
  });

  it('should emit onClose when close event is triggered', () => {
    component.onClose.emit();
    
    expect(host.onClose).toHaveBeenCalled();
  });

  it('should emit onSelect when select event is triggered', () => {
    const selectedItem = { id: 1, name: 'Selected Item' };
    
    component.onSelect.emit(selectedItem);
    
    expect(host.onSelect).toHaveBeenCalledWith(selectedItem);
  });

  it('should set itemsLoaded to true after loading completes', (done) => {
    // Simula o estado de loading
    host.isLoading = true;
    fixture.detectChanges();
    
    expect(component.itemsLoaded()).toBe(false);
    
    // Para o loading
    host.isLoading = false;
    fixture.detectChanges();
    
    // Aguarda o setTimeout interno do effect
    setTimeout(() => {
      expect(component.itemsLoaded()).toBe(true);
      done();
    }, 1100); // Um pouco mais que o timeout interno de 1000ms
  });

  it('should handle empty list of values', () => {
    host.listOfValues = [];
    fixture.detectChanges();
    
    expect(component.listOfValues()).toEqual([]);
    expect(component.listOfValues().length).toBe(0);
  });

  it('should handle list with multiple items', () => {
    const mockValues = [
      { id: 1, name: 'Item 1', category: 'A' },
      { id: 2, name: 'Item 2', category: 'B' },
      { id: 3, name: 'Item 3', category: 'A' }
    ];
    
    host.listOfValues = mockValues;
    fixture.detectChanges();
    
    expect(component.listOfValues()).toEqual(mockValues);
    expect(component.listOfValues().length).toBe(3);
  });

  it('should handle map with addons', () => {
    const mapWithAddons: acMap = {
      code: { key: 'id', title: 'ID' },
      desc: { key: 'name', title: 'Name' },
      addons: [
        { key: 'category', title: 'Category' },
        { key: 'price', title: 'Price' }
      ]
    };
    
    host.map = mapWithAddons;
    fixture.detectChanges();
    
    expect(component.map()).toEqual(mapWithAddons);
    expect(component.map().addons).toBeDefined();
    expect(component.map().addons?.length).toBe(2);
  });

  it('should maintain loading state consistency', () => {
    // Inicia sem loading
    expect(component.isLoading()).toBe(false);
    expect(component.itemsLoaded()).toBe(true);
    
    // Ativa loading
    host.isLoading = true;
    fixture.detectChanges();
    
    expect(component.isLoading()).toBe(true);
    expect(component.itemsLoaded()).toBe(false);
    
    // Desativa loading
    host.isLoading = false;
    fixture.detectChanges();
    
    expect(component.isLoading()).toBe(false);
    // itemsLoaded ainda pode estar false até o setTimeout completar
  });

  it('should handle rapid loading state changes', () => {
    // Testa mudanças rápidas de estado
    host.isLoading = true;
    fixture.detectChanges();
    expect(component.itemsLoaded()).toBe(false);
    
    host.isLoading = false;
    fixture.detectChanges();
    
    host.isLoading = true;
    fixture.detectChanges();
    expect(component.itemsLoaded()).toBe(false);
  });

  it('should work with different data types in listOfValues', () => {
    const mixedData = [
      { id: 1, name: 'String Item' },
      { id: 2, name: 'Number Item', value: 123 },
      { id: 3, name: 'Boolean Item', active: true },
      { id: 4, name: 'Date Item', date: new Date('2024-01-01') }
    ];
    
    host.listOfValues = mixedData;
    fixture.detectChanges();
    
    expect(component.listOfValues()).toEqual(mixedData);
    expect(component.listOfValues()[0].name).toBe('String Item');
    expect(component.listOfValues()[1].value).toBe(123);
    expect(component.listOfValues()[2].active).toBe(true);
    expect(component.listOfValues()[3].date).toBeInstanceOf(Date);
  });
});
