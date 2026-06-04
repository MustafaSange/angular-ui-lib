import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'accordion',
    loadComponent: () => import('./features/accordion/accordion').then((m) => m.Accordion),
  },
  {
    path: 'feedback',
    loadComponent: () => import('./features/feedback/feedback').then((m) => m.Feedback),
  },
  {
    path: 'badge',
    loadComponent: () => import('./features/badge/badge').then((m) => m.Badge),
  },
  {
    path: 'bottom-sheet',
    loadComponent: () => import('./features/bottom-sheet/bottom-sheet').then((m) => m.BottomSheet),
  },
  {
    path: 'buttons',
    loadComponent: () => import('./features/buttons/buttons').then((m) => m.Buttons),
  },
  {
    path: 'button-toggle',
    loadComponent: () =>
      import('./features/button-toggle/button-toggle').then((m) => m.ButtonToggle),
  },
  {
    path: 'chip',
    loadComponent: () => import('./features/chip/chip').then((m) => m.Chip),
  },
  {
    path: 'clipboard',
    loadComponent: () => import('./features/clipboard/clipboard').then((m) => m.Clipboard),
  },
  {
    path: 'form-fields',
    loadComponent: () => import('./features/form-fields/form-fields').then((m) => m.FormFields),
  },
  {
    path: 'grid',
    loadComponent: () => import('./features/grid/grid').then((m) => m.Grid),
  },
  {
    path: 'menu-popover',
    loadComponent: () => import('./features/menu-popover/menu-popover').then((m) => m.MenuPopover),
  },
  {
    path: 'modal',
    loadComponent: () => import('./features/modal/modal').then((m) => m.Modal),
  },
  {
    path: 'drawer',
    loadComponent: () => import('./features/drawer/drawer').then((m) => m.Drawer),
  },
  {
    path: 'pagination',
    loadComponent: () => import('./features/pagination/pagination').then((m) => m.Pagination),
  },
  {
    path: 'side-nav',
    loadComponent: () => import('./features/side-nav/side-nav').then((m) => m.SideNav),
  },
  {
    path: 'stepper',
    loadComponent: () => import('./features/stepper/stepper').then((m) => m.Stepper),
  },
  {
    path: 'tables',
    loadComponent: () => import('./features/tables/tables').then((m) => m.Tables),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./features/tabs/tabs').then((m) => m.Tabs),
  },
  {
    path: 'tooltip',
    loadComponent: () => import('./features/tooltip/tooltip').then((m) => m.Tooltip),
  },
];
