import { Component, input } from '@angular/core';

import type { ProgressKind, ProgressSize } from './progress-indicator-types';

@Component({
  selector: 'ms-spinner',
  templateUrl: './spinner.html',
})
export class SpinnerComponent {
  readonly size = input<ProgressSize>('md');
  readonly kind = input<ProgressKind>('primary');
  readonly ariaLabel = input('Loading');
}
