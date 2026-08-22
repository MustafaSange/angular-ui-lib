import { Component, computed, inject, input } from '@angular/core';

import { LanguageService } from '../../services/language';
import type { BreadcrumbSize } from './breadcrumb-types';

@Component({
  selector: 'ms-breadcrumb',
  templateUrl: './breadcrumb.html',
  host: {
    '[style.--_breadcrumb-gap]': 'sizeValue().gap',
    '[style.--_breadcrumb-item-gap]': 'sizeValue().itemGap',
    '[style.--_breadcrumb-font-size]': 'sizeValue().fontSize',
  },
})
export class BreadcrumbComponent {
  private readonly languageService = inject(LanguageService);
  readonly label = input<string | null>(null);
  readonly size = input<BreadcrumbSize>('md');
  protected readonly resolvedLabel = computed(
    () => this.label() ?? this.languageService.translate('accessibility.breadcrumb'),
  );

  protected readonly sizeValue = computed(() => {
    switch (this.size()) {
      case 'sm':
        return {
          gap: 'var(--spacing-4)',
          itemGap: 'var(--spacing-4)',
          fontSize: 'var(--font-size-xs)',
        };
      case 'md':
      default:
        return {
          gap: 'var(--spacing-8)',
          itemGap: 'var(--spacing-8)',
          fontSize: 'var(--font-size-sm)',
        };
    }
  });
}
