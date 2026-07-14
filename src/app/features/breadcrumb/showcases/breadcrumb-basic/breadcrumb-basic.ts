import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
} from '../../../../shared/ui-lib/components/breadcrumb';
import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-breadcrumb-basic-showcase',
  imports: [RouterLink, BreadcrumbComponent, BreadcrumbItemDirective, ShowcaseCode],
  templateUrl: './breadcrumb-basic.html',
  styleUrl: '../breadcrumb-showcase.scss',
  host: {
    class: 'breadcrumb-section',
  },
})
export class BreadcrumbBasicShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbComponent, BreadcrumbItemDirective } from './shared/ui-lib';

@Component({
  selector: 'app-basic-breadcrumb-example',
  imports: [RouterLink, BreadcrumbComponent, BreadcrumbItemDirective],
  template: \`
    <ms-breadcrumb>
      <a msBreadcrumbItem routerLink="/">Home</a>
      <a msBreadcrumbItem routerLink="/components">Components</a>
      <span msBreadcrumbItem current>Breadcrumb</span>
    </ms-breadcrumb>
  \`,
})
export class BasicBreadcrumbExample {}`;
}
