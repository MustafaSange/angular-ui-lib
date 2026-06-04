import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbComponent, BreadcrumbItemDirective } from '../../../../shared/components/breadcrumb';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-breadcrumb-long-label-showcase',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, ShowcaseCode],
  templateUrl: './breadcrumb-long-label.html',
  styleUrl: '../breadcrumb-showcase.scss',
  host: {
    class: 'breadcrumb-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbLongLabelShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbComponent, BreadcrumbItemDirective } from './shared/components/breadcrumb';

@Component({
  selector: 'app-long-label-breadcrumb-example',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective],
  template: \`
    <ms-breadcrumb label="Workspace location">
      <a msBreadcrumbItem href="/">Home</a>
      <a msBreadcrumbItem href="/workspaces">International design systems workspace</a>
      <a msBreadcrumbItem href="/workspaces/components">Navigation primitives and patterns</a>
      <span msBreadcrumbItem current>Breadcrumb implementation guidance</span>
    </ms-breadcrumb>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongLabelBreadcrumbExample {}`;
}
