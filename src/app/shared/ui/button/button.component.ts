import { booleanAttribute, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'text';
export type ButtonSize = 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<ButtonType>('button');
}
