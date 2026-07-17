import { Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from '../../../../shared/ui-lib/components/breadcrumb';
import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-breadcrumb-separators-showcase',
  imports: [
    BreadcrumbComponent,
    BreadcrumbItemDirective,
    BreadcrumbSeparatorDirective,
    ShowcaseCode,
  ],
  templateUrl: './breadcrumb-separators.html',
  styleUrl: '../breadcrumb-showcase.scss',
  host: {
    class: 'breadcrumb-section',
  },
})
export class BreadcrumbSeparatorsShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-custom-breadcrumb-separator-example',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbSeparatorDirective],
  template: \`
    <ms-breadcrumb label="Documentation Path">
      <a msBreadcrumbItem href="/docs">Docs</a>
      <span msBreadcrumbSeparator aria-hidden="true">/</span>
      <a msBreadcrumbItem href="/docs/components">Components</a>
      <span msBreadcrumbSeparator aria-hidden="true">/</span>
      <span msBreadcrumbItem current>Breadcrumb</span>
    </ms-breadcrumb>
  \`,
})
export class CustomBreadcrumbSeparatorExample {}`;
}
