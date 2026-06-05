import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import {
  TooltipComponent,
  TooltipPanelComponent,
  TooltipTrigger,
} from '../../shared/ui-lib/components/tooltip';

@Component({
  selector: 'app-tooltip',
  imports: [RouterLink, ShowcaseCode, TooltipComponent, TooltipPanelComponent, TooltipTrigger],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip {
  protected readonly basicSnippet = `import { Component } from '@angular/core';

import { TooltipComponent, TooltipPanelComponent, TooltipTrigger, } from './shared/ui-lib';

@Component({
  selector: 'app-icon-tooltip-example', imports: [TooltipComponent, TooltipPanelComponent, TooltipTrigger], template: \`
    <ms-tooltip>
      <button class="btn btn-ghost btn-icon" type="button" msTooltipTrigger aria-label="Details">
        <span class="ms-icon" aria-hidden="true">info_i</span>
      </button>

      <ms-tooltip-panel>Invitees receive an email notification.</ms-tooltip-panel>
    </ms-tooltip>
  \`, })
export class IconTooltipExample {}`;

  protected readonly placementSnippet = `import { Component } from '@angular/core';

import { TooltipComponent, TooltipPanelComponent, TooltipTrigger, } from './shared/ui-lib';

@Component({
  selector: 'app-tooltip-placement-example', imports: [TooltipComponent, TooltipPanelComponent, TooltipTrigger], template: \`
    <ms-tooltip placement="top">
      <button class="btn btn-outline" type="button" msTooltipTrigger>Top</button>
      <ms-tooltip-panel>Appears above the action.</ms-tooltip-panel>
    </ms-tooltip>

    <ms-tooltip placement="bottom">
      <button class="btn btn-outline" type="button" msTooltipTrigger>Bottom</button>
      <ms-tooltip-panel>Appears below the action.</ms-tooltip-panel>
    </ms-tooltip>

    <div dir="rtl">
      <ms-tooltip placement="start">
        <button class="btn btn-outline" type="button" msTooltipTrigger>Start</button>
        <ms-tooltip-panel>Mirrors to inline start.</ms-tooltip-panel>
      </ms-tooltip>

      <ms-tooltip placement="end">
        <button class="btn btn-outline" type="button" msTooltipTrigger>End</button>
        <ms-tooltip-panel>Mirrors to inline end.</ms-tooltip-panel>
      </ms-tooltip>
    </div>
  \`, })
export class TooltipPlacementExample {}`;

  protected readonly triggerSnippet = `import { Component } from '@angular/core';

import {
  TooltipComponent,
  TooltipPanelComponent,
  TooltipTrigger,
} from './shared/ui-lib';

@Component({
  selector: 'app-tooltip-trigger-example',
  imports: [TooltipComponent, TooltipPanelComponent, TooltipTrigger],
  template: \`
    <ms-tooltip placement="bottom">
      <a href="/guides/releases" msTooltipTrigger>Release guide</a>
      <ms-tooltip-panel>Read the publishing checklist.</ms-tooltip-panel>
    </ms-tooltip>

    <label for="build-tag">Build tag</label>
    <ms-tooltip placement="bottom">
      <input
        id="build-tag"
        type="text"
        value="release/tooltip"
        aria-describedby="build-tag-help"
        msTooltipTrigger
      />
      <ms-tooltip-panel>Tags are included in generated notes.</ms-tooltip-panel>
    </ms-tooltip>
    <span id="build-tag-help">Use lowercase words separated by slashes.</span>

    <ms-tooltip>
      <span role="button" tabindex="0" aria-disabled="true" msTooltipTrigger>
        <button type="button" disabled tabindex="-1" aria-hidden="true">Publish</button>
      </span>
      <ms-tooltip-panel>Finish required checks before publishing.</ms-tooltip-panel>
    </ms-tooltip>
  \`,
})
export class TooltipTriggerExample {}`;
}
