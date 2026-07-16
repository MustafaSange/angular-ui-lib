import { Directive, input } from '@angular/core';

import type { UiDensity } from '../../services/density-types';

@Directive({
  selector: '[msDensity]',
  host: {
    '[attr.data-density]': 'density()',
  },
})
export class DensityDirective {
  readonly density = input.required<UiDensity>({ alias: 'msDensity' });
}
