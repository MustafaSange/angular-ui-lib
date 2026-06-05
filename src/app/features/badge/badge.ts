import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeComponent } from '../../shared/ui-lib/components/badge';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-badge',
  imports: [RouterLink, BadgeComponent, ShowcaseCode],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  protected readonly variantsSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-variants-example', imports: [BadgeComponent], template: \`
    <ms-badge>Neutral</ms-badge>
    <ms-badge variant="info">Info</ms-badge>
    <ms-badge variant="success">Success</ms-badge>
    <ms-badge variant="warning">Warning</ms-badge>
    <ms-badge variant="danger">Danger</ms-badge>
  \`, })
export class BadgeVariantsExample {}`;

  protected readonly appearancesSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-appearances-example', imports: [BadgeComponent], template: \`
    <ms-badge variant="info" appearance="soft">Soft</ms-badge>
    <ms-badge variant="info" appearance="solid">Solid</ms-badge>
    <ms-badge variant="info" appearance="outline">Outline</ms-badge>
  \`, })
export class BadgeAppearancesExample {}`;

  protected readonly dotsCountsSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-dots-counts-example', imports: [BadgeComponent], template: \`
    <ms-badge variant="success" dot>Online</ms-badge>
    <ms-badge variant="warning" dot>Syncing</ms-badge>
    <ms-badge variant="danger" aria-label="12 unread notifications">12</ms-badge>
    <ms-badge variant="info" appearance="solid" aria-label="99 or more updates">99+</ms-badge>
  \`, })
export class BadgeDotsCountsExample {}`;

  protected readonly iconsSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-icons-example', imports: [BadgeComponent], template: \`
    <ms-badge variant="success">
      <span class="ms-icon" aria-hidden="true">check_circle</span>
      Verified
    </ms-badge>
    <ms-badge variant="info" appearance="outline">
      <span class="ms-icon" aria-hidden="true">filter_list</span>
      Filtered
    </ms-badge>
  \`, })
export class BadgeIconsExample {}`;

  protected readonly rtlSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-rtl-example',
  imports: [BadgeComponent],
  template: \`
    <div dir="rtl">
      <ms-badge variant="success" dot>متصل</ms-badge>
      <ms-badge variant="info" appearance="outline">
        <span class="ms-icon" aria-hidden="true">check_circle</span>
        موثق
      </ms-badge>
    </div>
  \`,
})
export class BadgeRtlExample {}`;
}
