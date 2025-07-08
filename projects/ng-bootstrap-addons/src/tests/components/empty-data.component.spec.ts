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
    const h2 = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
    expect(h2.textContent?.trim()).toBe('NENHUM REGISTRO');

    const h3 = fixture.debugElement.query(By.css('h3')).nativeElement as HTMLElement;
    expect(h3.textContent?.trim()).toBe('ENCONTRADO');
  });
});
