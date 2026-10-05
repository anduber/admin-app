import { Component, computed, input } from '@angular/core';
import { CardComponent } from '../../../../shared/ui/card/card.component';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly progress = input(0);

  protected readonly safeProgress = computed(() => {
    const progress = this.progress();
    return Number.isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
  });
}
