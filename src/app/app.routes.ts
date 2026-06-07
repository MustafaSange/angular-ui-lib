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
    path: 'autocomplete',
    loadComponent: () => import('./features/autocomplete/autocomplete').then((m) => m.Autocomplete),
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
    path: 'breadcrumb',
    loadComponent: () => import('./features/breadcrumb/breadcrumb').then((m) => m.Breadcrumb),
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
    path: 'card',
    loadComponent: () => import('./features/card/card').then((m) => m.Card),
  },
  {
    path: 'chip',
    loadComponent: () => import('./features/chip/chip').then((m) => m.Chip),
  },
  {
    path: 'checkbox',
    loadComponent: () => import('./features/checkbox/checkbox').then((m) => m.Checkbox),
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
    path: 'media-slider',
    loadComponent: () =>
      import('./features/media-slider/media-slider').then((m) => m.MediaSlider),
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
    path: 'radio',
    loadComponent: () => import('./features/radio/radio').then((m) => m.Radio),
  },
  {
    path: 'side-nav',
    loadComponent: () => import('./features/side-nav/side-nav').then((m) => m.SideNav),
  },
  {
    path: 'signal-form-field',
    loadComponent: () =>
      import('./features/signal-form-field/signal-form-field').then((m) => m.SignalFormFieldPage),
  },
  {
    path: 'select',
    loadComponent: () => import('./features/select/select').then((m) => m.Select),
  },
  {
    path: 'slider',
    loadComponent: () => import('./features/slider/slider').then((m) => m.Slider),
  },
  {
    path: 'stepper',
    loadComponent: () => import('./features/stepper/stepper').then((m) => m.Stepper),
  },
  {
    path: 'switch',
    loadComponent: () => import('./features/switch/switch').then((m) => m.Switch),
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
