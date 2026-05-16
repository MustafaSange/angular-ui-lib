import { Routes } from '@angular/router';

import { Buttons } from './features/buttons/buttons';
import { Grid } from './features/grid/grid';

export const routes: Routes = [
  {
    path: 'buttons',
    component: Buttons,
  },
  {
    path: 'grid',
    component: Grid,
  },
];
