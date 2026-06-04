import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DrawerClose,
  DrawerComponent,
  DrawerTrigger,
} from '../../shared/ui-lib/components/drawer';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-drawer',
  imports: [DrawerClose, DrawerComponent, DrawerTrigger, RouterLink, ShowcaseCode],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer {
  protected readonly startOpen = signal(false);
  protected readonly rtlOpen = signal(false);
  protected readonly endOpen = signal(false);

  protected readonly startSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DrawerClose, DrawerComponent, DrawerTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-navigation-drawer-example',
  imports: [DrawerClose, DrawerComponent, DrawerTrigger],
  template: \`
    <button
      class="btn btn-ghost btn-icon"
      type="button"
      [msDrawerTrigger]="drawer"
      aria-label="Open navigation"
    >
      <span class="ms-icon" aria-hidden="true">menu</span>
    </button>

    <ms-drawer #drawer="msDrawer" [(open)]="drawerOpen" aria-label="Main navigation">
      <div class="drawer-header">
        <strong>Navigation</strong>
        <button class="btn btn-ghost btn-icon" type="button" msDrawerClose aria-label="Close navigation">
          <span class="ms-icon" aria-hidden="true">close</span>
        </button>
      </div>

      <nav class="drawer-content navigation-list" aria-label="Primary">
        <a href="/buttons" msDrawerClose>Buttons</a>
        <a href="/form-fields" msDrawerClose>Form fields</a>
        <a href="/tables" msDrawerClose>Tables</a>
      </nav>
    </ms-drawer>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerExample {
  protected readonly drawerOpen = signal(false);
}`;

  protected readonly rtlSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DrawerClose, DrawerComponent, DrawerTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-rtl-navigation-drawer-example',
  imports: [DrawerClose, DrawerComponent, DrawerTrigger],
  template: \`
    <div dir="rtl">
      <button class="btn btn-outline" type="button" [msDrawerTrigger]="drawer">
        افتح التنقل
        <span class="ms-icon" aria-hidden="true">menu</span>
      </button>

      <ms-drawer #drawer="msDrawer" [(open)]="drawerOpen" aria-label="التنقل الرئيسي">
        <div class="drawer-header">
          <strong>التنقل</strong>
          <button class="btn btn-ghost btn-icon" type="button" msDrawerClose aria-label="إغلاق التنقل">
            <span class="ms-icon" aria-hidden="true">close</span>
          </button>
        </div>

        <nav class="drawer-content navigation-list" aria-label="رئيسي">
          <a href="/buttons" msDrawerClose>الأزرار</a>
          <a href="/form-fields" msDrawerClose>حقول النماذج</a>
          <a href="/tables" msDrawerClose>الجداول</a>
        </nav>
      </ms-drawer>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RtlNavigationDrawerExample {
  protected readonly drawerOpen = signal(false);
}`;

  protected readonly endSnippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DrawerClose, DrawerComponent, DrawerTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-end-drawer-example',
  imports: [DrawerClose, DrawerComponent, DrawerTrigger],
  template: \`
    <button class="btn btn-outline" type="button" [msDrawerTrigger]="drawer">
      Account menu
      <span class="ms-icon" aria-hidden="true">menu_open</span>
    </button>

    <ms-drawer #drawer="msDrawer" [(open)]="open" placement="end" aria-label="Account navigation">
      <div class="drawer-header">
        <strong>Account</strong>
        <button class="btn btn-ghost btn-icon" type="button" msDrawerClose aria-label="Close account menu">
          <span class="ms-icon" aria-hidden="true">close</span>
        </button>
      </div>

      <nav class="drawer-content navigation-list" aria-label="Account">
        <a href="/badge" msDrawerClose>Badge</a>
        <a href="/chip" msDrawerClose>Chip</a>
        <a href="/feedback" msDrawerClose>Feedback</a>
      </nav>
    </ms-drawer>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndDrawerExample {
  protected readonly open = signal(false);
}`;
}
