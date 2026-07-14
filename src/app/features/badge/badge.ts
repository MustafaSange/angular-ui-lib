import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeComponent } from '../../shared/ui-lib/components/badge';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-badge',
  imports: [RouterLink, BadgeComponent, ShowcaseCode],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  protected readonly kindsSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-kinds-example', imports: [BadgeComponent], template: \`
    <ms-badge>Neutral</ms-badge>
    <ms-badge kind="info">Info</ms-badge>
    <ms-badge kind="success">Success</ms-badge>
    <ms-badge kind="warning">Warning</ms-badge>
    <ms-badge kind="danger">Danger</ms-badge>
  \`, })
export class BadgeKindsExample {}`;

  protected readonly appearancesSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-appearances-example', imports: [BadgeComponent], template: \`
    <ms-badge kind="info" appearance="soft">Soft</ms-badge>
    <ms-badge kind="info" appearance="solid">Solid</ms-badge>
    <ms-badge kind="info" appearance="outline">Outline</ms-badge>
  \`, })
export class BadgeAppearancesExample {}`;

  protected readonly radiusSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-radius-example', imports: [BadgeComponent], template: \`
    <ms-badge kind="success" radius="none">None</ms-badge>
    <ms-badge kind="success" radius="sm">Small</ms-badge>
    <ms-badge kind="success" radius="md">Medium</ms-badge>
    <ms-badge kind="success" radius="lg">Large</ms-badge>
    <ms-badge kind="success" radius="xl">Extra large</ms-badge>
    <ms-badge kind="success">Full</ms-badge>
  \`, })
export class BadgeRadiusExample {}`;

  protected readonly dotsCountsSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-dots-counts-example', imports: [BadgeComponent], template: \`
    <ms-badge kind="success" dot>Online</ms-badge>
    <ms-badge kind="warning" dot>Syncing</ms-badge>
    <ms-badge kind="danger" aria-label="12 unread notifications">12</ms-badge>
    <ms-badge kind="info" appearance="solid" aria-label="99 or more updates">99+</ms-badge>
  \`, })
export class BadgeDotsCountsExample {}`;

  protected readonly iconsSnippet = `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-badge-icons-example', imports: [BadgeComponent], template: \`
    <ms-badge kind="success">
      <span class="ms-icon" aria-hidden="true">check_circle</span>
      Verified
    </ms-badge>
    <ms-badge kind="info" appearance="outline">
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
      <ms-badge kind="success" dot>متصل</ms-badge>
      <ms-badge kind="info" appearance="outline">
        <span class="ms-icon" aria-hidden="true">check_circle</span>
        موثق
      </ms-badge>
    </div>
  \`,
})
export class BadgeRtlExample {}`;
}
