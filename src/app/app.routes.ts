import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', children: [] },
  { path: 'analytics', children: [] },
  { path: '**', redirectTo: 'dashboard' },
];
