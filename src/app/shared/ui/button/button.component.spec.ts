import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent, ButtonType } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `
    <form
      (submit)="submitCount = submitCount + 1; $event.preventDefault()"
      (reset)="resetCount = resetCount + 1"
    >
      <app-button>Primary Button</app-button>
      <app-button variant="outline">Outline Button</app-button>
      <app-button variant="text">Text Button</app-button>
      <app-button [disabled]="disabled()" (click)="disabledClickCount = disabledClickCount + 1">
        Disabled
      </app-button>
      <app-button size="large" [type]="formButtonType()">Form Button</app-button>
    </form>
  `,
})
class ButtonTestHost {
  disabled = signal(true);
  disabledClickCount = 0;
  formButtonType = signal<ButtonType>('button');
  submitCount = 0;
  resetCount = 0;
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonTestHost>;
  let host: ButtonTestHost;
  let buttons: NodeListOf<HTMLButtonElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ButtonTestHost] }).compileComponents();
    fixture = TestBed.createComponent(ButtonTestHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
    buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
  });

  it('renders projected content and variants with a safe default button type', () => {
    expect(buttons).toHaveLength(5);
    expect(buttons[0].textContent?.trim()).toBe('Primary Button');
    expect(buttons[0].classList.contains('button--primary')).toBe(true);
    expect(buttons[0].classList.contains('button--large')).toBe(false);
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].textContent?.trim()).toBe('Outline Button');
    expect(buttons[1].classList.contains('button--outline')).toBe(true);
    expect(buttons[2].textContent?.trim()).toBe('Text Button');
    expect(buttons[2].classList.contains('button--text')).toBe(true);
    expect(buttons[4].classList.contains('button--large')).toBe(true);
    buttons.forEach((button) => expect(button.type).toBe('button'));
    buttons[0].click();
    expect(host.submitCount).toBe(0);
  });

  it('blocks native clicks while disabled and supports enabling the button', async () => {
    expect(buttons[3].textContent?.trim()).toBe('Disabled');
    expect(buttons[3].hasAttribute('disabled')).toBe(true);
    buttons[3].click();
    expect(host.disabledClickCount).toBe(0);

    host.disabled.set(false);
    await fixture.whenStable();
    expect(buttons[3].hasAttribute('disabled')).toBe(false);
    buttons[3].click();
    expect(host.disabledClickCount).toBe(1);
  });

  it('maps submit and reset types to native form behavior', async () => {
    host.formButtonType.set('submit');
    await fixture.whenStable();
    expect(buttons[4].type).toBe('submit');
    buttons[4].click();
    expect(host.submitCount).toBe(1);
    expect(host.resetCount).toBe(0);

    host.formButtonType.set('reset');
    await fixture.whenStable();
    expect(buttons[4].type).toBe('reset');
    buttons[4].click();
    expect(host.resetCount).toBe(1);
  });
});
