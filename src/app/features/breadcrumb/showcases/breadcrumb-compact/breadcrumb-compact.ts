import { Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
} from '../../../../shared/ui-lib/components/breadcrumb';
import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-breadcrumb-compact-showcase',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, ShowcaseCode],
  templateUrl: './breadcrumb-compact.html',
  styleUrl: '../breadcrumb-showcase.scss',
  host: {
    class: 'breadcrumb-section',
  },
})
export class BreadcrumbCompactShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { BreadcrumbComponent, BreadcrumbItemDirective } from './shared/ui-lib';

@Component({
  selector: 'app-compact-breadcrumb-example',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective],
  template: \`
    <ms-breadcrumb label="Documentation path" size="sm">
      <a msBreadcrumbItem href="/docs">Docs</a>
      <a msBreadcrumbItem href="/docs/components">Components</a>
      <span msBreadcrumbItem current>Breadcrumb</span>
    </ms-breadcrumb>
  \`,
})
export class CompactBreadcrumbExample {}`;
}
