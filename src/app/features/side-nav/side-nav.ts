import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  SideNavComponent,
  SideNavItem,
  SideNavSectionComponent,
  SideNavTrigger,
} from '../../shared/ui-lib/components/side-nav';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    ShowcaseCode,
    SideNavComponent,
    SideNavItem,
    SideNavSectionComponent,
    SideNavTrigger,
  ],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNav {
  protected readonly expandedCollapsed = signal(false);
  protected readonly railCollapsed = signal(true);
  protected readonly rtlCollapsed = signal(true);

  protected readonly expandedSnippet = `import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  SideNavComponent, SideNavItem, SideNavSectionComponent, SideNavTrigger, } from './shared/ui-lib';

@Component({
  selector: 'app-side-nav-example', imports: [
    RouterLink, RouterLinkActive, SideNavComponent, SideNavItem, SideNavSectionComponent, SideNavTrigger, ], template: \`
    <ms-side-nav [(collapsed)]="collapsed" aria-label="Primary navigation">
      <button type="button" msSideNavTrigger aria-label="Toggle navigation">
        <span class="ms-icon" aria-hidden="true">menu</span>
      </button>

      <a msSideNavItem routerLink="/dashboard" routerLinkActive="is-active">
        <span class="ms-icon" aria-hidden="true">dashboard</span>
        <span class="side-nav-label">Dashboard</span>
      </a>

      <ms-side-nav-section label="Projects" icon="folder" [(expanded)]="projectsOpen">
        <a msSideNavItem routerLink="/projects/active" routerLinkActive="is-active">
          Active projects
        </a>
        <ms-side-nav-section label="Reports" icon="bar_chart">
          <a msSideNavItem routerLink="/projects/reports/weekly" routerLinkActive="is-active">
            Weekly
          </a>
          <a msSideNavItem routerLink="/projects/reports/monthly" routerLinkActive="is-active">
            Monthly
          </a>
        </ms-side-nav-section>
      </ms-side-nav-section>
    </ms-side-nav>
  \`, })
export class SideNavExample {
  protected readonly collapsed = signal(false);
  protected readonly projectsOpen = signal(true);
}`;

  protected readonly collapsedSnippet = `import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  SideNavComponent,
  SideNavItem,
  SideNavSectionComponent,
  SideNavTrigger,
} from './shared/ui-lib';

@Component({
  selector: 'app-collapsed-side-nav-example',
  imports: [
    RouterLink,
    RouterLinkActive,
    SideNavComponent,
    SideNavItem,
    SideNavSectionComponent,
    SideNavTrigger,
  ],
  template: \`
    <ms-side-nav [(collapsed)]="collapsed" aria-label="Primary navigation">
      <button type="button" msSideNavTrigger aria-label="Toggle navigation">
        <span class="ms-icon" aria-hidden="true">menu</span>
      </button>

      <a msSideNavItem routerLink="/dashboard" routerLinkActive="is-active">
        <span class="ms-icon" aria-hidden="true">dashboard</span>
        <span class="side-nav-label">Dashboard</span>
      </a>

      <ms-side-nav-section label="Projects" icon="folder">
        <a msSideNavItem routerLink="/projects/active" routerLinkActive="is-active">
          Active projects
        </a>
        <button type="button" msSideNavItem [active]="true">Pinned review</button>
      </ms-side-nav-section>
    </ms-side-nav>
  \`,
})
export class CollapsedSideNavExample {
  protected readonly collapsed = signal(true);
}`;

  protected readonly manualActiveSnippet = `<button type="button" msSideNavItem [active]="true">
  <span class="ms-icon" aria-hidden="true">settings</span>
  <span class="side-nav-label">Settings</span>
</button>`;
}
