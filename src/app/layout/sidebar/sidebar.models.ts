export type SidebarNavIcon = 'home' | 'pages' | 'applications' | 'ecommerce' | 'authentication';

export interface SidebarNavChild {
  label: string;
  route?: string;
}

export interface SidebarNavItem {
  label: string;
  icon: SidebarNavIcon;
  route?: string;
  children?: SidebarNavChild[];
}
