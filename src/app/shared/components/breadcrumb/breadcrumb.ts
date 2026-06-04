import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { BreadcrumbSize } from './breadcrumb-types';

@Component({
  selector: 'ms-breadcrumb',
  templateUrl: './breadcrumb.html',
  host: {
    '[class.breadcrumb-size-sm]': "size() === 'sm'",
    '[class.breadcrumb-size-md]': "size() === 'md'",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly label = input('Breadcrumb');
  readonly size = input<BreadcrumbSize>('md');
}
