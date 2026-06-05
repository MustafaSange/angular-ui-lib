import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  MenuComponent,
  MenuDividerComponent,
  MenuItem,
  MenuPanelComponent,
  MenuTrigger,
  PopoverClose,
  PopoverComponent,
  PopoverPanelComponent,
  PopoverTrigger,
} from '../../shared/ui-lib/components/menu-popover';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-menu-popover',
  imports: [
    RouterLink,
    MenuComponent,
    MenuDividerComponent,
    MenuItem,
    MenuPanelComponent,
    MenuTrigger,
    PopoverClose,
    PopoverComponent,
    PopoverPanelComponent,
    PopoverTrigger,
    ShowcaseCode,
    SignalFormField,
  ],
  templateUrl: './menu-popover.html',
  styleUrl: './menu-popover.scss',
})
export class MenuPopover {
  protected readonly filtersOpen = signal(false);
  protected readonly selectedAction = signal('No project action selected.');
  protected readonly appliedFilters = signal('Showing all projects.');

  protected readonly basicMenuSnippet = `import { Component } from '@angular/core';

import { MenuComponent, MenuItem, MenuPanelComponent, MenuTrigger, } from './shared/ui-lib';

@Component({
  selector: 'app-action-menu-example', imports: [MenuComponent, MenuItem, MenuPanelComponent, MenuTrigger], template: \`
    <ms-menu>
      <button class="btn btn-outline" type="button" msMenuTrigger>
        Workspace
        <span class="ms-icon" aria-hidden="true">expand_more</span>
      </button>

      <ms-menu-panel aria-label="Workspace actions">
        <button type="button" msMenuItem>Open dashboard</button>
        <button type="button" msMenuItem>Invite members</button>
        <button type="button" msMenuItem>Manage billing</button>
      </ms-menu-panel>
    </ms-menu>
  \`, })
export class ActionMenuExample {}`;

  protected readonly variantsMenuSnippet = `import { Component, signal } from '@angular/core';

import { MenuComponent, MenuDividerComponent, MenuItem, MenuPanelComponent, MenuTrigger, } from './shared/ui-lib';

@Component({
  selector: 'app-project-actions-example', imports: [MenuComponent, MenuDividerComponent, MenuItem, MenuPanelComponent, MenuTrigger], template: \`
    <ms-menu placement="bottom-end">
      <button
        class="btn btn-ghost btn-icon"
        type="button"
        msMenuTrigger
        aria-label="Project actions"
      >
        <span class="ms-icon" aria-hidden="true">more_vert</span>
      </button>

      <ms-menu-panel aria-label="Project actions">
        <button type="button" msMenuItem (click)="result.set('Renamed project.')">
          <span class="ms-icon" aria-hidden="true">edit</span>
          Rename
        </button>
        <a href="/projects/archive" msMenuItem>
          <span class="ms-icon" aria-hidden="true">archive</span>
          Archive project
        </a>
        <button type="button" msMenuItem disabled>Transfer ownership</button>
        <ms-menu-divider />
        <button type="button" msMenuItem (click)="result.set('Deleted project.')">
          <span class="ms-icon" aria-hidden="true">delete</span>
          Delete project
        </button>
      </ms-menu-panel>
    </ms-menu>

    <p>{{ result() }}</p>
  \`, })
export class ProjectActionsExample {
  protected readonly result = signal('No project action selected.');
}`;

  protected readonly placementMenuSnippet = `import { Component } from '@angular/core';

import { MenuComponent, MenuItem, MenuPanelComponent, MenuTrigger, } from './shared/ui-lib';

@Component({
  selector: 'app-overflow-menu-example', imports: [MenuComponent, MenuItem, MenuPanelComponent, MenuTrigger], template: \`
    <div class="toolbar">
      <span>Release activity</span>

      <ms-menu placement="bottom-end">
        <button class="btn btn-ghost btn-icon" type="button" msMenuTrigger aria-label="More">
          <span class="ms-icon" aria-hidden="true">more_vert</span>
        </button>

        <ms-menu-panel aria-label="Release actions">
          <button type="button" msMenuItem>Download report</button>
          <button type="button" msMenuItem>Share activity</button>
        </ms-menu-panel>
      </ms-menu>
    </div>
  \`, })
export class OverflowMenuExample {}`;

  protected readonly popoverSnippet = `import { Component, signal } from '@angular/core';

import { PopoverClose, PopoverComponent, PopoverPanelComponent, PopoverTrigger, } from './shared/ui-lib';
import { SignalFormField } from '../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-filter-popover-example', imports: [
    PopoverClose, PopoverComponent, PopoverPanelComponent, PopoverTrigger, SignalFormField, ], template: \`
    <ms-popover [(open)]="filtersOpen">
      <button class="btn btn-outline" type="button" msPopoverTrigger>
        <span class="ms-icon" aria-hidden="true">filter_list</span>
        Filters
      </button>

      <ms-popover-panel>
        <form aria-label="Project filters" (submit)="$event.preventDefault()">
          <h2>Filters</h2>

          <ms-signal-form-field>
            <label for="filter-status">Status</label>
            <select id="filter-status">
              <option>All projects</option>
              <option>Active</option>
              <option>Archived</option>
            </select>
          </ms-signal-form-field>

          <div class="actions">
            <button class="btn btn-ghost" type="button" msPopoverClose>Cancel</button>
            <button class="btn btn-primary" type="submit" msPopoverClose>Apply</button>
          </div>
        </form>
      </ms-popover-panel>
    </ms-popover>
  \`, })
export class FilterPopoverExample {
  protected readonly filtersOpen = signal(false);
}`;

  protected readonly sidePopoverSnippet = `import { Component } from '@angular/core';

import {
  PopoverClose,
  PopoverComponent,
  PopoverPanelComponent,
  PopoverTrigger,
} from './shared/ui-lib';

@Component({
  selector: 'app-side-popover-example',
  imports: [PopoverClose, PopoverComponent, PopoverPanelComponent, PopoverTrigger],
  template: \`
    <ms-popover placement="end-top">
      <button class="btn btn-outline" type="button" msPopoverTrigger>View details</button>

      <ms-popover-panel aria-label="Release details">
        <h2>Release ready</h2>
        <p>Checks passed and the package is ready to publish.</p>
        <button class="btn btn-primary btn-sm" type="button" msPopoverClose>Done</button>
      </ms-popover-panel>
    </ms-popover>

    <div dir="rtl">
      <span>Scoped RTL context</span>
      <ms-popover placement="end-top">
        <button class="btn btn-outline" type="button" msPopoverTrigger>View details</button>

        <ms-popover-panel aria-label="Release details in RTL context">
          <h2>Release ready</h2>
          <p>Checks passed and the package is ready to publish.</p>
          <button class="btn btn-primary btn-sm" type="button" msPopoverClose>Done</button>
        </ms-popover-panel>
      </ms-popover>
    </div>
  \`,
})
export class SidePopoverExample {}`;

  protected chooseAction(action: string): void {
    this.selectedAction.set(action);
  }

  protected applyFilters(event: Event): void {
    event.preventDefault();
    this.appliedFilters.set('Showing active projects owned by this team.');
  }
}
