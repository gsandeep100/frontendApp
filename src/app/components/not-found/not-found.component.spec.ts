import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NotFoundComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the 404 message', () => {
    const title = compiled.querySelector('h1');
    const message = compiled.querySelector('p.text-xl');
    const suggestion = compiled.querySelector('p.my-2');

    expect(title?.textContent).toContain('404');
    expect(message?.textContent).toContain(
      'Sorry, The page you were looking for was not found.'
    );
    expect(suggestion?.textContent).toContain('Maybe your URL is incorrect.');
  });

  it('should render a button to return home with correct RouterLink', () => {
    const button = compiled.querySelector('button');

    expect(button?.textContent).toContain('Return Home');
    const routerLinkAttr = button?.getAttribute('ng-reflect-router-link');
    expect(routerLinkAttr).toBe('/');
  });
});
