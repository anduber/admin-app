import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextFieldComponent, TextFieldType, TextFieldValue } from './text-field.component';

@Component({
  imports: [ReactiveFormsModule, TextFieldComponent],
  template: `
    <form [formGroup]="form" (submit)="submitCount = submitCount + 1; $event.preventDefault()">
      <app-text-field
        label="Email"
        inputId="email-input"
        placeholder="Enter email"
        name="email"
        autocomplete="email"
        [type]="type()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [required]="required()"
        formControlName="value"
      >
        <span textFieldPrefix aria-hidden="true">&#64;</span>
      </app-text-field>
    </form>
    <app-text-field placeholder="Second field" />
    <app-text-field label="Third field" />
  `,
})
class TextFieldTestHost {
  readonly form = new FormGroup({ value: new FormControl<TextFieldValue>('initial') });
  readonly type = signal<TextFieldType>('text');
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  submitCount = 0;
}

describe('TextFieldComponent', () => {
  let fixture: ComponentFixture<TextFieldTestHost>;
  let host: TextFieldTestHost;
  let element: HTMLElement;
  let nativeInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TextFieldTestHost] }).compileComponents();
    fixture = TestBed.createComponent(TextFieldTestHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
    nativeInput = element.querySelector('input')!;
  });

  it('associates labels with unique IDs and projects optional prefix content', () => {
    const inputs = element.querySelectorAll('input');
    const labels = element.querySelectorAll('label');
    expect(nativeInput.id).toBe('email-input');
    expect(labels[0].htmlFor).toBe(nativeInput.id);
    expect(labels[0].control).toBe(nativeInput);
    expect(new Set(Array.from(inputs, (input) => input.id)).size).toBe(3);
    expect(labels[1].htmlFor).toBe(inputs[2].id);
    expect(element.querySelectorAll('app-text-field')[1].querySelector('label')).toBeNull();
    expect(inputs[1].getAttribute('aria-label')).toBe('Second field');
    expect(nativeInput.placeholder).toBe('Enter email');
    expect(nativeInput.name).toBe('email');
    expect(nativeInput.autocomplete).toBe('email');
    expect(nativeInput.type).toBe('text');
    expect(element.querySelector('[textFieldPrefix]')?.textContent).toBe('@');
    expect(element.querySelector('button')).toBeNull();
  });

  it('updates the reactive form while typing and marks the control touched on blur', () => {
    const control = host.form.controls.value;
    expect(nativeInput.value).toBe('initial');
    expect(control.untouched).toBe(true);
    nativeInput.value = 'person@example.com';
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(control.value).toBe('person@example.com');
    expect(control.dirty).toBe(true);
    expect(control.untouched).toBe(true);
    nativeInput.dispatchEvent(new Event('blur'));
    expect(control.touched).toBe(true);
  });

  it('renders programmatic values and reset without emitting an extra change', async () => {
    const control = host.form.controls.value;
    const changes = vi.fn();
    const subscription = control.valueChanges.subscribe(changes);

    control.setValue('updated externally');
    await fixture.whenStable();
    expect(nativeInput.value).toBe('updated externally');
    expect(changes).toHaveBeenCalledTimes(1);

    control.reset();
    await fixture.whenStable();
    expect(nativeInput.value).toBe('');
    expect(control.value).toBeNull();
    expect(changes).toHaveBeenCalledTimes(2);
    subscription.unsubscribe();
  });

  it('returns numeric values and null for an empty number input', async () => {
    host.form.controls.value.setValue(42);
    host.type.set('number');
    await fixture.whenStable();
    expect(nativeInput.value).toBe('42');
    expect(nativeInput.type).toBe('number');

    nativeInput.value = '12.5';
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(host.form.controls.value.value).toBe(12.5);
    nativeInput.value = '';
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(host.form.controls.value.value).toBeNull();
  });

  it('toggles a password with one accessible icon without submitting the form', async () => {
    host.type.set('password');
    host.form.controls.value.setValue('sample-password');
    await fixture.whenStable();
    const toggle = element.querySelector('button')!;

    expect(nativeInput.type).toBe('password');
    expect(toggle.type).toBe('button');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.getAttribute('aria-controls')).toBe(nativeInput.id);
    expect(toggle.querySelectorAll('svg')).toHaveLength(1);

    toggle.click();
    await fixture.whenStable();
    expect(nativeInput.type).toBe('text');
    expect(nativeInput.value).toBe('sample-password');
    expect(toggle.getAttribute('aria-label')).toBe('Hide password');
    expect(toggle.querySelectorAll('svg')).toHaveLength(1);
    expect(toggle.querySelectorAll('path')).toHaveLength(2);

    toggle.click();
    await fixture.whenStable();
    expect(nativeInput.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.querySelectorAll('path')).toHaveLength(1);
    expect(host.submitCount).toBe(0);
    expect(host.form.controls.value.value).toBe('sample-password');
  });

  it('disables the input and toggle from the FormControl and the disabled input', async () => {
    host.type.set('password');
    host.form.controls.value.disable();
    await fixture.whenStable();
    const toggle = element.querySelector('button')!;

    expect(nativeInput.disabled).toBe(true);
    expect(toggle.disabled).toBe(true);
    toggle.click();
    await fixture.whenStable();
    expect(nativeInput.type).toBe('password');
    nativeInput.value = 'blocked edit';
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(host.form.controls.value.value).toBe('initial');

    host.form.controls.value.enable();
    await fixture.whenStable();
    expect(nativeInput.disabled).toBe(false);
    expect(toggle.disabled).toBe(false);

    host.disabled.set(true);
    await fixture.whenStable();
    expect(nativeInput.disabled).toBe(true);
    expect(toggle.disabled).toBe(true);
  });

  it('keeps readonly fields focusable while blocking edits and forwards required', async () => {
    host.readonly.set(true);
    host.required.set(true);
    await fixture.whenStable();
    expect(nativeInput.readOnly).toBe(true);
    expect(nativeInput.disabled).toBe(false);
    expect(nativeInput.required).toBe(true);
    nativeInput.focus();
    expect(document.activeElement).toBe(nativeInput);

    nativeInput.value = 'blocked edit';
    nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(host.form.controls.value.value).toBe('initial');

    host.form.controls.value.setValue('Readonly value');
    await fixture.whenStable();
    expect(nativeInput.value).toBe('Readonly value');
  });
});
