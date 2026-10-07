import { Component } from '@angular/core';
import { NavGroupComponent } from './components/nav-group/nav-group.component';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';
import { SidebarNavItem } from './sidebar.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NavGroupComponent, SidebarUserComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly navigationItems: SidebarNavItem[] = [
    {
      label: 'Home',
      icon: 'home',
      children: [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Analytics', route: '/analytics' },
      ],
    },
    { label: 'Pages', icon: 'pages', children: [] },
    { label: 'Applications', icon: 'applications', children: [] },
    { label: 'E-commerce', icon: 'ecommerce', children: [] },
    { label: 'Authentication', icon: 'authentication', children: [] },
  ];
}
