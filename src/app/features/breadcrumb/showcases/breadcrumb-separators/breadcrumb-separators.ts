import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from '../../../../shared/components/breadcrumb';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-breadcrumb-separators-showcase',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbSeparatorDirective, ShowcaseCode],
  templateUrl: './breadcrumb-separators.html',
  styleUrl: '../breadcrumb-showcase.scss',
  host: {
    class: 'breadcrumb-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbSeparatorsShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
} from './shared/components/breadcrumb';

@Component({
  selector: 'app-custom-breadcrumb-separator-example',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbSeparatorDirective],
  template: \`
    <ms-breadcrumb label="Documentation path">
      <a msBreadcrumbItem href="/docs">Docs</a>
      <span msBreadcrumbSeparator aria-hidden="true">/</span>
      <a msBreadcrumbItem href="/docs/components">Components</a>
      <span msBreadcrumbSeparator aria-hidden="true">/</span>
      <span msBreadcrumbItem current>Breadcrumb</span>
    </ms-breadcrumb>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBreadcrumbSeparatorExample {}`;
}
