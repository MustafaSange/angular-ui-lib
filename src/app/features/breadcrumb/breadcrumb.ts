import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbBasicShowcase } from './showcases/breadcrumb-basic/breadcrumb-basic';
import { BreadcrumbCompactShowcase } from './showcases/breadcrumb-compact/breadcrumb-compact';
import { BreadcrumbLongLabelShowcase } from './showcases/breadcrumb-long-label/breadcrumb-long-label';
import { BreadcrumbOverflowShowcase } from './showcases/breadcrumb-overflow/breadcrumb-overflow';
import { BreadcrumbRtlShowcase } from './showcases/breadcrumb-rtl/breadcrumb-rtl';
import { BreadcrumbSeparatorsShowcase } from './showcases/breadcrumb-separators/breadcrumb-separators';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    RouterLink,
    BreadcrumbBasicShowcase,
    BreadcrumbCompactShowcase,
    BreadcrumbSeparatorsShowcase,
    BreadcrumbOverflowShowcase,
    BreadcrumbLongLabelShowcase,
    BreadcrumbRtlShowcase,
  ],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb {}
