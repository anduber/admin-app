import { booleanAttribute, Component, input } from '@angular/core';

export type CardPadding = 'none' | 'small' | 'medium' | 'large';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly padding = input<CardPadding>('medium');
  readonly shadow = input(false, { transform: booleanAttribute });
  readonly bordered = input(true, { transform: booleanAttribute });
}
