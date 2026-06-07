import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import {
  TabComponent,
  TabTitleDirective,
  TabsComponent,
} from '../../shared/ui-lib/components/tabs';

@Component({
  selector: 'app-tabs',
  imports: [RouterLink, ShowcaseCode, TabsComponent, TabComponent, TabTitleDirective],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  protected readonly simpleSnippet = `import { Component } from '@angular/core';

import { TabComponent, TabsComponent } from './shared/ui-lib';

@Component({
  selector: 'app-simple-tabs-example', imports: [TabsComponent, TabComponent], template: \`
    <ms-tabs>
      <ms-tab title="Overview">
        <p>Track open work, recent decisions, and ownership in one place.</p>
      </ms-tab>

      <ms-tab title="Activity">
        <p>Review imports, approvals, and release events from the last week.</p>
      </ms-tab>

      <ms-tab title="Settings">
        <p>Adjust notifications and workspace defaults for this project.</p>
      </ms-tab>
    </ms-tabs>
  \`, })
export class SimpleTabsExample {}`;

  protected readonly projectedTitleSnippet = `import { Component } from '@angular/core';

import { TabComponent, TabTitleDirective, TabsComponent } from './shared/ui-lib';

@Component({
  selector: 'app-projected-title-tabs-example', imports: [TabsComponent, TabComponent, TabTitleDirective], template: \`
    <ms-tabs>
      <ms-tab title="Profile">
        <p>Profile details are ready for review.</p>
      </ms-tab>

      <ms-tab>
        <ng-template msTabTitle>
          Billing <span class="badge">3</span>
        </ng-template>

        <p>Three invoices need attention before the next renewal.</p>
      </ms-tab>

      <ms-tab>
        <ng-template msTabTitle>
          Security <span class="status-dot" aria-hidden="true"></span>
        </ng-template>

        <p>Two-factor authentication is enabled for all administrators.</p>
      </ms-tab>
    </ms-tabs>
  \`,
  styles: [\`
    .status-dot {
      display: inline-block;
      inline-size: 0.5rem;
      block-size: 0.5rem;
      margin-inline-start: 0.375rem;
      border-radius: 999px;
      background: var(--color-success);
      vertical-align: middle;
    }
  \`],
})
export class ProjectedTitleTabsExample {}`;

  protected readonly overflowSnippet = `import { Component } from '@angular/core';

import { TabComponent, TabsComponent } from './shared/ui-lib';

@Component({
  selector: 'app-overflow-tabs-example', imports: [TabsComponent, TabComponent], template: \`
    <ms-tabs>
      <ms-tab title="Overview">
        <p>Track open work, recent decisions, and ownership in one place.</p>
      </ms-tab>

      <ms-tab title="Roadmap">
        <p>Review planned milestones and upcoming delivery windows.</p>
      </ms-tab>

      <ms-tab title="Activity">
        <p>Review imports, approvals, and release events from the last week.</p>
      </ms-tab>

      <ms-tab title="Approvals">
        <p>Confirm pending approvals before sharing the release.</p>
      </ms-tab>

      <ms-tab title="Permissions">
        <p>Audit access levels for editors, reviewers, and administrators.</p>
      </ms-tab>

      <ms-tab title="Billing">
        <p>Check usage, invoices, and renewal details.</p>
      </ms-tab>

      <ms-tab title="Settings">
        <p>Adjust notifications and workspace defaults for this project.</p>
      </ms-tab>
    </ms-tabs>
  \`, })
export class OverflowTabsExample {}`;

  protected readonly keyboardSnippet = `import { Component } from '@angular/core';

import { TabComponent, TabsComponent } from './shared/ui-lib';

@Component({
  selector: 'app-keyboard-tabs-example',
  imports: [TabsComponent, TabComponent],
  template: \`
    <div dir="rtl">
      <ms-tabs>
        <ms-tab title="First">
          <p>Use arrow keys to move through tabs in this RTL container.</p>
        </ms-tab>

        <ms-tab title="Second">
          <p>Left and right arrows mirror logical inline direction.</p>
        </ms-tab>

        <ms-tab title="Third">
          <p>Home selects the first tab and End selects the last tab.</p>
        </ms-tab>
      </ms-tabs>
    </div>
  \`,
})
export class KeyboardTabsExample {}`;
}
