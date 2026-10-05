import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app.component';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render all seven button showcase examples', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toBe('Button Component');
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('app-button button');
    expect(Array.from(buttons, (button) => button.textContent?.trim())).toEqual([
      'Primary Button',
      'Large Primary',
      'Outline Button',
      'Withdraw All Earnings',
      'Text Button',
      'Disabled Button',
      'Submit',
    ]);
    expect(buttons[5].disabled).toBe(true);
    expect(buttons[6].type).toBe('submit');
  });

  it('should navigate to the root and redirect unknown routes to it', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    expect(await router.navigateByUrl('/')).toBe(true);
    expect(router.url).toBe('/');

    expect(await router.navigateByUrl('/route-check')).toBe(true);
    expect(router.url).toBe('/');
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toBe(
      'Button Component',
    );
  });

  it('should render the text field showcase and connect the reactive form examples', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-field-showcase h1')?.textContent).toBe(
      'TextField Component',
    );
    expect(compiled.querySelectorAll('app-text-field')).toHaveLength(9);
    const inputs = compiled.querySelectorAll<HTMLInputElement>('form app-text-field input');
    expect(inputs).toHaveLength(2);

    inputs[0].value = 'person@example.com';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.form.controls.email.value).toBe('person@example.com');

    fixture.componentInstance.form.controls.password.setValue('example-password');
    await fixture.whenStable();
    expect(inputs[1].value).toBe('example-password');

    fixture.componentInstance.form.controls.email.disable();
    await fixture.whenStable();
    expect(inputs[0].disabled).toBe(true);
  });
});
