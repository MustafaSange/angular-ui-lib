import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/components/showcase-code';
import { TabComponent, TabTitleDirective, TabsComponent } from '../../shared/components/tabs';

@Component({
  selector: 'app-tabs',
  imports: [RouterLink, ShowcaseCode, TabsComponent, TabComponent, TabTitleDirective],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs {
  protected readonly simpleSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TabComponent, TabsComponent } from './shared/components/tabs';

@Component({
  selector: 'app-simple-tabs-example',
  imports: [TabsComponent, TabComponent],
  template: \`
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
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTabsExample {}`;

  protected readonly projectedTitleSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TabComponent, TabTitleDirective, TabsComponent } from './shared/components/tabs';

@Component({
  selector: 'app-projected-title-tabs-example',
  imports: [TabsComponent, TabComponent, TabTitleDirective],
  template: \`
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectedTitleTabsExample {}`;

  protected readonly keyboardSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TabComponent, TabsComponent } from './shared/components/tabs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardTabsExample {}`;
}
