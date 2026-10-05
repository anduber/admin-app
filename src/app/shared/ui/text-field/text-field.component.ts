import {
  APP_ID,
  booleanAttribute,
  Component,
  computed,
  forwardRef,
  inject,
  Injectable,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type TextFieldType = 'text' | 'email' | 'password' | 'search' | 'number' | 'tel';
export type TextFieldValue = string | number | null;

// An application-scoped counter starts fresh for each SSR request and browser bootstrap.
@Injectable({ providedIn: 'root' })
class TextFieldIds {
  private readonly appId = inject(APP_ID);
  private nextId = 0;

  next(): string {
    return `text-field-${this.appId}-${this.nextId++}`;
  }
}

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly type = input<TextFieldType>('text');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly name = input<string>();
  readonly autocomplete = input<string>();
  readonly inputId = input<string>();
  readonly ariaLabel = input<string>();

  private readonly generatedId = inject(TextFieldIds).next();
  private readonly formDisabled = signal(false);
  private onChange: (value: TextFieldValue) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly value = signal<TextFieldValue>(null);
  protected readonly passwordVisible = signal(false);
  protected readonly resolvedId = computed(() => this.inputId() ?? this.generatedId);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly inputType = computed(() =>
    this.type() === 'password' && this.passwordVisible() ? 'text' : this.type(),
  );

  writeValue(value: TextFieldValue): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: TextFieldValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected handleInput(event: Event): void {
    const element = event.target;
    if (!(element instanceof HTMLInputElement) || this.isDisabled() || this.readonly()) {
      return;
    }

    const value =
      this.type() === 'number'
        ? element.value === ''
          ? null
          : element.valueAsNumber
        : element.value;

    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  protected togglePasswordVisibility(): void {
    if (!this.isDisabled()) {
      this.passwordVisible.update((visible) => !visible);
    }
  }
}
