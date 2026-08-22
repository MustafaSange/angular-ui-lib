import { Component, computed, inject, input } from '@angular/core';

import { LanguageService } from '../../services/language';
import type { ProgressKind, ProgressSize, SpinnerVariant } from './progress-indicator-types';

@Component({
  selector: 'ms-spinner',
  templateUrl: './spinner.html',
})
export class SpinnerComponent {
  private readonly languageService = inject(LanguageService);
  readonly size = input<ProgressSize>('md');
  readonly kind = input<ProgressKind>('primary');
  readonly variant = input<SpinnerVariant>('ring');
  readonly ariaLabel = input<string | null>(null);
  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.languageService.translate('common.loading'),
  );
}
