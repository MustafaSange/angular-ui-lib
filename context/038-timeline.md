# Feature 038: Timeline

## Goal

Create a reusable timeline component for displaying ordered workflow progress. Timelines support
vertical and horizontal layouts, neutral connector rails, workflow status markers, optional
structured item text, custom marker icons, and fully projected item body content.

The timeline is display-focused. It does not control selected panels or progression state like the
stepper component.

## Non-Goals

- Interactive step selection, keyboard navigation between steps, and panel switching are out of
  scope.
- Built-in previous, next, submit, approve, or reject actions are out of scope.
- Data-array rendering is out of scope for v1; consumers compose timelines with projected
  `ms-timeline-item` children.
- Status-specific connector coloring is out of scope for v1. Connector rails stay neutral.

## Public API

Import timeline primitives from the folder barrel or the top-level UI library barrel:

```ts
import {
  TimelineComponent,
  TimelineItemComponent,
  TimelineItemStatus,
  TimelineMetaDirective,
  TimelineOrientation,
  TimelineSubtitleDirective,
  TimelineTitleDirective,
} from '../../shared/ui-lib';
```

Public pieces:

- `TimelineComponent` with selector `ms-timeline`
- `TimelineItemComponent` with selector `ms-timeline-item`
- `TimelineTitleDirective` with selector `ng-template[msTimelineTitle]`
- `TimelineSubtitleDirective` with selector `ng-template[msTimelineSubtitle]`
- `TimelineMetaDirective` with selector `ng-template[msTimelineMeta]`
- `TimelineOrientation` type exported from `timeline-types.ts`
- `TimelineItemStatus` type exported from `timeline-types.ts`

Required API:

```ts
type TimelineOrientation = 'vertical' | 'horizontal';

type TimelineItemStatus =
  | 'done'
  | 'in-progress'
  | 'pending'
  | 'blocked'
  | 'error'
  | 'skipped'
  | 'cancelled';

class TimelineComponent {
  readonly orientation = input<TimelineOrientation>('vertical');
  readonly ariaLabel = input('Timeline');
}

class TimelineItemComponent {
  readonly status = input<TimelineItemStatus>('pending');
  readonly title = input('');
  readonly subtitle = input('');
  readonly meta = input('');
  readonly icon = input('');
}
```

Defaults:

- timelines render vertically by default
- timeline containers use `aria-label="Timeline"` by default
- items use `status="pending"` by default
- `title`, `subtitle`, `meta`, and `icon` default to empty strings
- projected `msTimelineTitle`, `msTimelineSubtitle`, and `msTimelineMeta` templates take precedence
  over their matching string inputs
- the marker icon uses the item `icon` input when provided; otherwise it uses the private default
  icon map in `timeline.ts`
- `pending` renders an empty marker by default

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.timeline`,
`.timeline-item`, `.timeline-marker`, `.timeline-connector`, `.timeline-content`,
`.timeline-title`, `.timeline-subtitle`, `.timeline-meta`, and `.timeline-body`.

## Desired Usage

Basic workflow timeline:

```ts
import { Component } from '@angular/core';

import { TimelineComponent, TimelineItemComponent } from './shared/ui-lib';

@Component({
  selector: 'app-timeline-example',
  imports: [TimelineComponent, TimelineItemComponent],
  template: `
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
  `,
})
export class TimelineExample {}
```

Projected structured content:

```ts
import { Component } from '@angular/core';

import {
  TimelineComponent,
  TimelineItemComponent,
  TimelineMetaDirective,
  TimelineSubtitleDirective,
  TimelineTitleDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-rich-timeline-example',
  imports: [
    TimelineComponent,
    TimelineItemComponent,
    TimelineTitleDirective,
    TimelineSubtitleDirective,
    TimelineMetaDirective,
  ],
  template: `
    <ms-timeline>
      <ms-timeline-item status="done">
        <ng-template msTimelineMeta>Completed</ng-template>
        <ng-template msTimelineTitle>
          Manager approval <span class="badge">Signed</span>
        </ng-template>
        <ng-template msTimelineSubtitle>Approved by Mariam Hassan</ng-template>

        <p>Budget and delivery impact were approved.</p>
      </ms-timeline-item>

      <ms-timeline-item status="blocked" title="Legal approval" subtitle="Missing vendor terms">
        <button class="btn btn-outline-primary" type="button">Upload terms</button>
      </ms-timeline-item>
    </ms-timeline>
  `,
})
export class RichTimelineExample {}
```

## Component Structure

The implementation lives in `src/app/shared/ui-lib/components/timeline`:

- `TimelineComponent` coordinates projected items, orientation classes, accessible labeling, and
  marker icon lookup
- `TimelineItemComponent` stores workflow status, optional title/subtitle/meta/icon inputs,
  optional projected structured text templates, and projected body content
- `TimelineTitleDirective`, `TimelineSubtitleDirective`, and `TimelineMetaDirective` mark projected
  structured text templates
- `TimelineOrientation` and `TimelineItemStatus` live in `timeline-types.ts`
- `index.ts` exposes the public API

`ms-timeline` renders an ordered list. Projected `ms-timeline-item` instances are queried as
children and do not render their own wrapper markup.

## Behavior

- Render projected timeline items in source order.
- Render a connector between adjacent items only; the last item has no connector.
- Keep connector lines neutral for every item status.
- Render vertical timelines as a stacked marker rail with content beside each marker.
- Render horizontal timelines as a scrollable inline workflow with content below each marker.
- Set `aria-current="step"` on items with `status="in-progress"`.
- Render projected meta/title/subtitle templates when present; otherwise render the matching input
  values when non-empty.
- Render projected body content inside `.timeline-body`.
- Use the `icon` input as an override for the marker icon when provided.
- Use the private status icon map when no icon override is provided.
- Do not render an icon glyph for `pending` unless the consumer provides an icon override.

## Status Icons

`TimelineComponent` keeps the default Material Symbols ligature for each status private:

- `done`: `check`
- `in-progress`: `sync`
- `pending`: empty icon
- `blocked`: `block`
- `error`: `close`
- `skipped`: `skip_next`
- `cancelled`: `cancel`

When a new default or showcase marker icon is introduced, add its ligature name to
`src/app/shared/ui-lib/services/material-icons/icon-registry.ts`.

## Styling

Feature styles live in `src/styles/components/_timeline.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing surface, text, border, spacing, typography, and radius tokens.
- Use logical block/inline properties so vertical and horizontal layouts work in both `dir="ltr"`
  and `dir="rtl"`.
- Use `.timeline-vertical` and `.timeline-horizontal` as orientation modifiers.
- Keep marker status color treatments token-based.
- Keep connector rails neutral and independent of item status.
- Keep horizontal timelines scrollable on narrow containers.
- Keep `.ms-icon { direction: ltr; }` behavior from the icon foundation for Material Symbols
  ligature rendering.

## Accessibility

- Render the timeline as an ordered list.
- Use the `ariaLabel` input to name the timeline list.
- Mark connector lines and marker icons as decorative with `aria-hidden="true"`.
- Use visible text content, not marker icons alone, to communicate workflow meaning.
- Set `aria-current="step"` on the in-progress item.
- Keep custom interactive controls inside item body projection owned by the consumer.

## Showcase

Add a dedicated `/timeline` page and home card demonstrating:

- basic vertical workflow timeline
- horizontal workflow timeline
- projected rich meta/title/subtitle/body content
- custom icon override

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection`
  metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Public timeline primitives are exported from the timeline barrel and top-level UI-lib barrel.
- The primary usage examples work as documented.
- Vertical and horizontal timelines both render.
- All workflow statuses render with the expected marker treatment.
- `in-progress` renders with `aria-current="step"`.
- Connector lines stay neutral regardless of item status.
- String inputs and projected structured text templates both render.
- Custom marker icons override status default icons.
- Timeline marker icons exist in `MATERIAL_ICONS`.
- Timeline styles use logical properties and work in LTR and RTL layouts.
- The `/timeline` showcase page and home card are available.
- Showcase snippets match the rendered examples.
