import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-sidebar-user',
  standalone: true,
  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.scss',
})
export class SidebarUserComponent {
  readonly name = input.required<string>();
  readonly email = input.required<string>();
  readonly avatarUrl = input<string>();

  protected readonly initial = computed(() => this.name().trim().charAt(0).toUpperCase());
}
