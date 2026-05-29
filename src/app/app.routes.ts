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
    loadComponent: () => import('./features/form-fields/form-fields').then((m) => m.FormFields),
  },
  {
    path: 'modal',
    loadComponent: () => import('./features/modal/modal').then((m) => m.Modal),
  },
  {
    path: 'feedback',
    loadComponent: () => import('./features/feedback/feedback').then((m) => m.Feedback),
  },
  {
    path: 'menu-popover',
    loadComponent: () => import('./features/menu-popover/menu-popover').then((m) => m.MenuPopover),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./features/tooltip/tooltip').then((m) => m.Tooltip),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./features/tabs/tabs').then((m) => m.Tabs),
  },
  {
    path: 'accordion',
    loadComponent: () => import('./features/accordion/accordion').then((m) => m.Accordion),
  },
  {
    path: 'badge',
    loadComponent: () => import('./features/badge/badge').then((m) => m.Badge),
  },
  {
    path: 'chip',
    loadComponent: () => import('./features/chip/chip').then((m) => m.Chip),
  },
];
