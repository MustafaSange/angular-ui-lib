import { DOCUMENT } from '@angular/common';
import { inject, Service, signal } from '@angular/core';

import { UI_LIB_CONFIG } from './density-config';
import type { UiDensity } from './density-types';

const DEFAULT_DENSITY: UiDensity = 'default';

@Service()
export class DensityService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(UI_LIB_CONFIG);
  private readonly densityState = signal<UiDensity>(this.config.density ?? DEFAULT_DENSITY);

  readonly density = this.densityState.asReadonly();

  constructor() {
    this.applyDensity(this.densityState());
  }

  setDensity(density: UiDensity): void {
    this.densityState.set(density);
    this.applyDensity(density);
  }

  private applyDensity(density: UiDensity): void {
    this.document.documentElement.dataset['density'] = density;
  }
}
