import { Component, computed, input } from '@angular/core';

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
  readonly label = input('Breadcrumb');
  readonly size = input<BreadcrumbSize>('md');

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
