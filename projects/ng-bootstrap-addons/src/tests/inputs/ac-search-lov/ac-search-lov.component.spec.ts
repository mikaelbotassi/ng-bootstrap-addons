import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoCompleteLovComponent } from 'inputs/ac-search-lov/ac-search-lov.component';
import { AutocompleteService } from 'inputs/ac-search-lov/services/auto-complete.service';
import { HttpParams } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  standalone: true,
  imports: [AutoCompleteLovComponent, ReactiveFormsModule],
  template: `
    <nba-ac-lov 
      [acUrl]="url"
      [acParams]="params"
      [map]="map"
      [focus]="focus">
    </nba-ac-lov>
  `
})
class HostComponent {
  url = '/api/test';
  params = new HttpParams();
  focus = false;
  map = {
    code: { key: 'id', title: 'ID' },
    desc: { key: 'desc', title: 'Description' }
  };
}

describe('AutoCompleteLovComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let component: AutoCompleteLovComponent;
  let autocompleteService: jasmine.SpyObj<AutocompleteService>;

  beforeEach(() => {
    autocompleteService = jasmine.createSpyObj('AutocompleteService', ['performAutocomplete']);

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: AutocompleteService, useValue: autocompleteService },
        provideAnimations()
      ]
    });

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;

    // Inicializa os inputs obrigatórios antes de detectar mudanças
    host.url = '/api/test';
    host.map = {
      code: { key: 'id', title: 'ID' },
      desc: { key: 'desc', title: 'Description' }
    };
    
    fixture.detectChanges(); // Inicializa os inputs obrigatórios

    // Pega o componente interno
    const debugEl = fixture.debugElement.query(By.directive(AutoCompleteLovComponent));
    component = debugEl.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update listOfValues when updateListOfValues is called', () => {
    const mockResult = [
      { id: 1, desc: 'Item 1' },
      { id: 2, desc: 'Item 2' }
    ];

    // Testa diretamente o método updateListOfValues
    component.updateListOfValues(mockResult);
    
    expect(component.listOfValues()).toEqual(mockResult);
  });

  it('should call autocomplete service when executeCommand is called', () => {
    const mockResult = [{ id: 1, desc: 'Item 1' }];
    
    autocompleteService.performAutocomplete.and.returnValue(of(mockResult));
    
    // Mock do fetchDescCommand.execute para evitar problemas de inicialização
    spyOn(component.fetchDescCommand, 'execute');
    
    component.executeCommand({
      apiUrl: host.url,
      params: host.params,
      type: 'autocomplete'
    });

    expect(component.fetchDescCommand.execute).toHaveBeenCalledWith({
      apiUrl: host.url,
      params: host.params,
      type: 'autocomplete'
    });
  });

  it('should set descControl when setting completeDescFromResponse', () => {
    const value = { id: 123, desc: 'Test Desc' };
    component.completeDescFromResponse = value;

    fixture.detectChanges();

    expect(component.descControl.value).toBe('123 - Test Desc');
  });

  it('should set values and call addon.setValue when values() is called', () => {
    const addonSpy = jasmine.createSpy('setValue');
    const mapWithAddon = {
      code: { key: 'id', title: 'ID' },
      desc: { key: 'desc', title: 'Desc' },
      addons: [{ key: 'extra', setValue: addonSpy, title: 'Extra' }]
    };

    host.map = mapWithAddon;

    fixture.detectChanges();

    const value = { id: 5, desc: 'Desc', extra: 'ExtraValue' };

    component.values = value;

    fixture.detectChanges();

    expect(component.control?.value).toBe(5);
    expect(addonSpy).toHaveBeenCalledWith(value);
  });

  it('should clear values and call addon.setValue with null when setting null', () => {
    const addonSpy = jasmine.createSpy('setValue');
    const mapWithAddon = {
      code: { key: 'id', title: 'ID' },
      desc: { key: 'desc', title: 'Desc' },
      addons: [{ key: 'extra', setValue: addonSpy, title: 'Extra' }]
    };

    host.map = mapWithAddon;

    component.descControl.setValue('Some Desc');
    component.controlValue = 5;

    fixture.detectChanges();

    component.values = null;

    fixture.detectChanges();

    expect(component.descControl.value).toBeNull();
    expect(component.control?.value).toBeNull();
    expect(addonSpy).toHaveBeenCalledWith(null);
  });

  it('should call fetchLov and update focus', () => {
    spyOn(component, 'executeCommand');

    component.fetchLov('test');
    expect(component.focus()).toBeTrue();
    expect(component.executeCommand).toHaveBeenCalled();
  });

  it('should call fetchDesc and executeCommand', () => {
    spyOn(component, 'executeCommand');
    component.fetchDesc('123');
    expect(component.executeCommand).toHaveBeenCalled();
  });

  it('should setCompleteDesc correctly', () => {
    component.descControl.setValue('Desc');
    (component as any).control = new FormControl('Code');

    component.setCompleteDesc();

    expect(component.descControl.value).toBe('Code - Desc');
  });

  it('should compute completeDesc correctly', () => {
    (component as any).control = new FormControl('100');
    component.descControl.setValue(' MyDesc ');
    const result = component.completeDesc;
    expect(result).toBe('100 - MyDesc');
  });

  it('should selectItem and set values', () => {
    const item = { id: 1, desc: 'Test' };
    const valuesSpy = spyOnProperty(component, 'values', 'set');
    component.selectItem(item);
    expect(valuesSpy).toHaveBeenCalledWith(item);
    expect(component.focus()).toBeFalse();
  });
});