import { Routes } from '@angular/router';

import { Buttons } from './features/buttons/buttons';
import { Grid } from './features/grid/grid';
import { Home } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'buttons',
    component: Buttons,
  },
  {
    path: 'grid',
    component: Grid,
  },
];
