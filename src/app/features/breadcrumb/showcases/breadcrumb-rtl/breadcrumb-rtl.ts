import { Component } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItemDirective,
} from '../../../../shared/ui-lib/components/breadcrumb';
import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-breadcrumb-rtl-showcase',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective, ShowcaseCode],
  templateUrl: './breadcrumb-rtl.html',
  styleUrl: '../breadcrumb-showcase.scss',
  host: {
    class: 'breadcrumb-section',
  },
})
export class BreadcrumbRtlShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

import { BreadcrumbComponent, BreadcrumbItemDirective } from './shared/ui-lib';

@Component({
  selector: 'app-breadcrumb-rtl-example',
  imports: [BreadcrumbComponent, BreadcrumbItemDirective],
  template: \`
    <div dir="rtl">
      <ms-breadcrumb label="مسار الصفحة">
        <a msBreadcrumbItem href="/">الرئيسية</a>
        <a msBreadcrumbItem href="/components">المكونات</a>
        <span msBreadcrumbItem current>مسار التنقل</span>
      </ms-breadcrumb>
    </div>
  \`,
})
export class BreadcrumbRtlExample {}`;
}
