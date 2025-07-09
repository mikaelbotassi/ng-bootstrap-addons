import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyDataComponent } from 'components/empty-data/empty-data.component';
import { By } from '@angular/platform-browser';

describe('EmptyDataComponent', () => {
  let fixture: ComponentFixture<EmptyDataComponent>;
  let component: EmptyDataComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmptyDataComponent]
    });

    fixture = TestBed.createComponent(EmptyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render SVG illustration', () => {
    const svg = fixture.debugElement.query(By.css('svg'));
    expect(svg).toBeTruthy();
  });

  it('should display the correct main text', () => {
    const h2 = fixture.debugElement.query(By.css('h2'));
    expect(h2).toBeTruthy();
    expect(h2.nativeElement.textContent?.trim()).toBe('NENHUM REGISTRO');

    const h6 = fixture.debugElement.query(By.css('h6'));
    expect(h6).toBeTruthy();
    expect(h6.nativeElement.textContent?.trim()).toBe('ENCONTRADO');
  });
});
