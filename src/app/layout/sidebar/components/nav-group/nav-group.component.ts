import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarNavItem } from '../../sidebar.models';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'app-nav-group',
  standalone: true,
  imports: [NgTemplateOutlet, RouterLink, NavItemComponent],
  templateUrl: './nav-group.component.html',
  styleUrl: './nav-group.component.scss',
})
export class NavGroupComponent {
  readonly item = input.required<SidebarNavItem>();
  readonly expanded = model(false);
  readonly active = input<boolean>();

  private readonly router = inject(Router);
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
    { initialValue: null },
  );

  protected readonly hasChildren = computed(() => (this.item().children?.length ?? 0) > 0);
  protected readonly isActive = computed(() => {
    this.navigationEnd();
    const active = this.active();
    if (active !== undefined) return active;

    const item = this.item();
    const routes = [item.route, ...(item.children ?? []).map((child) => child.route)];
    return routes.some(
      (route) =>
        route !== undefined &&
        this.router.isActive(route, {
          paths: 'subset',
          queryParams: 'ignored',
          fragment: 'ignored',
          matrixParams: 'ignored',
        }),
    );
  });

  protected toggle(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
