import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'buttons',
    loadComponent: () => import('./features/buttons/buttons').then((m) => m.Buttons),
  },
  {
    path: 'grid',
    loadComponent: () => import('./features/grid/grid').then((m) => m.Grid),
  },
  {
    path: 'form-fields',
    loadComponent: () =>
      import('./features/form-fields/form-fields').then((m) => m.FormFields),
  },
  {
    path: 'modal',
    loadComponent: () => import('./features/modal/modal').then((m) => m.Modal),
  },
];
