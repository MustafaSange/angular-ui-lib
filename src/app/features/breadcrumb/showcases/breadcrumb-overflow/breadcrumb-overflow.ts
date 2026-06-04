import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from '../../../../shared/ui-lib/components/breadcrumb';
import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-breadcrumb-overflow-showcase',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbSeparatorDirective, ShowcaseCode],
  templateUrl: './breadcrumb-overflow.html',
  styleUrl: '../breadcrumb-showcase.scss',
  host: {
    class: 'breadcrumb-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbOverflowShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-overflow-breadcrumb-example',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbSeparatorDirective],
  template: \`
    <ms-breadcrumb label="Project location">
      <a msBreadcrumbItem href="/">Home</a>
      <span class="ms-icon" msBreadcrumbSeparator aria-hidden="true">chevron_right</span>
      <button class="btn btn-ghost btn-icon btn-sm" type="button" aria-label="Show parent pages">
        <span class="ms-icon" aria-hidden="true">more_horiz</span>
      </button>
      <span class="ms-icon" msBreadcrumbSeparator aria-hidden="true">chevron_right</span>
      <a msBreadcrumbItem href="/projects/design-system">Design system</a>
      <span class="ms-icon" msBreadcrumbSeparator aria-hidden="true">chevron_right</span>
      <span msBreadcrumbItem current>Components</span>
    </ms-breadcrumb>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverflowBreadcrumbExample {}`;
}
