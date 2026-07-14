import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeComponent } from '../../shared/ui-lib/components/badge';
import { ShowcaseCode } from '../../shared/showcase-code';
import {
  TimelineComponent,
  TimelineItemComponent,
  TimelineMetaDirective,
  TimelineSubtitleDirective,
  TimelineTitleDirective,
} from '../../shared/ui-lib/components/timeline';

@Component({
  selector: 'app-timeline',
  imports: [
    RouterLink,
    ShowcaseCode,
    TimelineComponent,
    TimelineItemComponent,
    TimelineTitleDirective,
    TimelineSubtitleDirective,
    TimelineMetaDirective,
    BadgeComponent,
  ],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  protected readonly verticalSnippet = `import { Component } from '@angular/core';

import { TimelineComponent, TimelineItemComponent } from './shared/ui-lib';

@Component({
  selector: 'app-workflow-timeline-example', imports: [TimelineComponent, TimelineItemComponent], template: \`
    <ms-timeline ariaLabel="Purchase request workflow">
      <ms-timeline-item status="done" title="Request submitted" meta="Today, 09:10">
        <p>The purchase request was sent to the approval queue.</p>
      </ms-timeline-item>

      <ms-timeline-item status="in-progress" title="Manager review" meta="Today, 10:25">
        <p>The team manager is reviewing budget and priority.</p>
      </ms-timeline-item>

      <ms-timeline-item status="pending" title="Finance review">
        <p>Finance review begins after manager approval.</p>
      </ms-timeline-item>
    </ms-timeline>
  \`, })
export class WorkflowTimelineExample {}`;

  protected readonly horizontalSnippet = `import { Component } from '@angular/core';

import { TimelineComponent, TimelineItemComponent } from './shared/ui-lib';

@Component({
  selector: 'app-horizontal-timeline-example', imports: [TimelineComponent, TimelineItemComponent], template: \`
    <ms-timeline orientation="horizontal" ariaLabel="Deployment workflow">
      <ms-timeline-item status="done" title="Build" subtitle="Package created" />
      <ms-timeline-item status="done" title="Test" subtitle="Checks passed" />
      <ms-timeline-item status="in-progress" title="Deploy" subtitle="Rolling out" />
      <ms-timeline-item status="pending" title="Verify" subtitle="Waiting" />
    </ms-timeline>
  \`, })
export class HorizontalTimelineExample {}`;

  protected readonly projectedSnippet = `import { Component } from '@angular/core';

import {
  BadgeComponent,
  TimelineComponent,
  TimelineItemComponent,
  TimelineMetaDirective,
  TimelineSubtitleDirective,
  TimelineTitleDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-projected-timeline-example',
  imports: [
    TimelineComponent,
    TimelineItemComponent,
    TimelineTitleDirective,
    TimelineSubtitleDirective,
    TimelineMetaDirective,
    BadgeComponent,
  ],
  template: \`
    <ms-timeline ariaLabel="Approval timeline">
      <ms-timeline-item status="done">
        <ng-template msTimelineMeta>Completed</ng-template>
        <ng-template msTimelineTitle>
          Manager approval <ms-badge kind="success">Signed</ms-badge>
        </ng-template>
        <ng-template msTimelineSubtitle>Approved by Mariam Hassan</ng-template>

        <p>Budget and delivery impact were approved.</p>
      </ms-timeline-item>

      <ms-timeline-item status="blocked" title="Legal approval" subtitle="Missing vendor terms">
        <button class="btn btn-outline-primary" type="button">Upload terms</button>
      </ms-timeline-item>
    </ms-timeline>
  \`,
})
export class ProjectedTimelineExample {}`;

  protected readonly customIconSnippet = `import { Component } from '@angular/core';

import { TimelineComponent, TimelineItemComponent } from './shared/ui-lib';

@Component({
  selector: 'app-custom-icon-timeline-example', imports: [TimelineComponent, TimelineItemComponent], template: \`
    <ms-timeline ariaLabel="Document workflow">
      <ms-timeline-item status="skipped" icon="redo" title="Secondary review skipped">
        <p>The requester selected the fast-track policy.</p>
      </ms-timeline-item>

      <ms-timeline-item status="cancelled" title="Archive cancelled">
        <p>The archive job was cancelled by an administrator.</p>
      </ms-timeline-item>
    </ms-timeline>
  \`, })
export class CustomIconTimelineExample {}`;
}
