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
import { ShowcaseCode } from '../../shared/showcase-code';
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
  protected readonly inlineEditorOpen = signal(false);
  protected readonly selectedAction = signal('No project action selected.');
  protected readonly appliedFilters = signal('Showing all projects.');
  protected readonly splitButtonResult = signal('No save action selected.');
  protected readonly projectName = signal('Project Alpha');
  protected readonly draftProjectName = signal(this.projectName());

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
        <button type="button" msMenuItem>Open Dashboard</button>
        <button type="button" msMenuItem>Invite Members</button>
        <button type="button" msMenuItem>Manage Billing</button>
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
        <button type="button" msMenuItem disabled>Transfer Ownership</button>
        <ms-menu-divider />
        <button type="button" msMenuItem (click)="result.set('Deleted project.')">
          <span class="ms-icon" aria-hidden="true">delete</span>
          Delete Project
        </button>
      </ms-menu-panel>
    </ms-menu>

    <p>{{ result() }}</p>
  \`, })
export class ProjectActionsExample {
  protected readonly result = signal('No project action selected.');
}`;

  protected readonly splitButtonSnippet = `import { Component, signal } from '@angular/core';

import { MenuComponent, MenuItem, MenuPanelComponent, MenuTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-split-button-example',
  imports: [MenuComponent, MenuItem, MenuPanelComponent, MenuTrigger],
  template: \`
    <div class="split-button">
      <button class="btn btn-primary" type="button" (click)="save('Saved changes.')">
        Save
      </button>

      <ms-menu placement="bottom-end">
        <button
          class="btn btn-primary btn-icon"
          type="button"
          msMenuTrigger
          aria-label="More save options"
        >
          <span class="ms-icon" aria-hidden="true">expand_more</span>
        </button>

        <ms-menu-panel aria-label="Save options">
          <button type="button" msMenuItem (click)="save('Saved as draft.')">Save Draft</button>
          <button type="button" msMenuItem (click)="save('Saved as template.')">
            Save as Template
          </button>
          <button type="button" msMenuItem (click)="save('Saved and published.')">
            Save and Publish
          </button>
        </ms-menu-panel>
      </ms-menu>
    </div>

    <p>{{ result() }}</p>
  \`,
  styles: [\`
    .split-button {
      display: inline-flex;
      align-items: stretch;
    }
  \`],
})
export class SplitButtonExample {
  protected readonly result = signal('No save action selected.');

  protected save(message: string): void {
    this.result.set(message);
  }
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
          <button type="button" msMenuItem>Download Report</button>
          <button type="button" msMenuItem>Share Activity</button>
        </ms-menu-panel>
      </ms-menu>
    </div>
  \`,
  styles: [\`
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
  \`],
})
export class OverflowMenuExample {}`;

  protected readonly popoverSnippet = `import { Component, signal } from '@angular/core';

import { PopoverClose, PopoverComponent, PopoverPanelComponent, PopoverTrigger, } from './shared/ui-lib';
import { SignalFormField } from './shared/ui-lib';

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
  \`,
  styles: [\`
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-block-start: 1rem;
    }
  \`],
})
export class FilterPopoverExample {
  protected readonly filtersOpen = signal(false);
}`;

  protected readonly inlineEditSnippet = `import { Component, signal } from '@angular/core';

import {
  PopoverClose,
  PopoverComponent,
  PopoverPanelComponent,
  PopoverTrigger,
  SignalFormField,
} from './shared/ui-lib';

@Component({
  selector: 'app-inline-edit-popover-example',
  imports: [PopoverClose, PopoverComponent, PopoverPanelComponent, PopoverTrigger, SignalFormField],
  template: \`
    <ms-popover [(open)]="editorOpen">
      <button class="editable-value" type="button" msPopoverTrigger (click)="startRename()">
        {{ projectName() }}
      </button>

      <ms-popover-panel aria-label="Edit project name">
        <form class="inline-editor" (submit)="saveRename($event)">
          <ms-signal-form-field>
            <label for="project-name">Project Name</label>
            <input
              id="project-name"
              type="text"
              [value]="draftProjectName()"
              (input)="updateDraftName($event)"
            />
          </ms-signal-form-field>

          <div class="actions">
            <button class="btn btn-ghost" type="button" msPopoverClose>Cancel</button>
            <button class="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
      </ms-popover-panel>
    </ms-popover>
  \`,
  styles: [\`
    .inline-editor {
      display: grid;
      gap: 0.75rem;
      inline-size: min(18rem, calc(100dvi - 3rem));
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  \`],
})
export class InlineEditPopoverExample {
  protected readonly editorOpen = signal(false);
  protected readonly projectName = signal('Project Alpha');
  protected readonly draftProjectName = signal(this.projectName());

  protected startRename(): void {
    this.draftProjectName.set(this.projectName());
  }

  protected updateDraftName(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.draftProjectName.set(target.value);
    }
  }

  protected saveRename(event: Event): void {
    event.preventDefault();

    const nextName = this.draftProjectName().trim();

    if (nextName) {
      this.projectName.set(nextName);
    }

    this.editorOpen.set(false);
  }
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
      <button class="btn btn-outline" type="button" msPopoverTrigger>View Details</button>

      <ms-popover-panel aria-label="Release details">
        <h2>Release Ready</h2>
        <p>Checks passed and the package is ready to publish.</p>
        <button class="btn btn-primary btn-sm" type="button" msPopoverClose>Done</button>
      </ms-popover-panel>
    </ms-popover>

    <div dir="rtl">
      <span>Scoped RTL context</span>
      <ms-popover placement="end-top">
        <button class="btn btn-outline" type="button" msPopoverTrigger>View Details</button>

        <ms-popover-panel aria-label="Release details in RTL context">
          <h2>Release Ready</h2>
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

  protected chooseSaveAction(action: string): void {
    this.splitButtonResult.set(action);
  }

  protected applyFilters(event: Event): void {
    event.preventDefault();
    this.appliedFilters.set('Showing active projects owned by this team.');
  }

  protected startProjectRename(): void {
    this.draftProjectName.set(this.projectName());
  }

  protected updateDraftProjectName(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.draftProjectName.set(target.value);
    }
  }

  protected saveProjectName(event: Event): void {
    event.preventDefault();

    const nextName = this.draftProjectName().trim();

    if (nextName) {
      this.projectName.set(nextName);
    }

    this.inlineEditorOpen.set(false);
  }
}
