# Feature 028: Stepper

## Goal

Create a reusable stepper component for guiding users through ordered, multi-step workflows.
Steppers support horizontal and vertical orientations, simple string labels, richer projected title
templates, completed and disabled step states, and optional linear progression while keeping each
step panel fully consumer-owned through projection.

## Non-Goals

- Built-in previous, next, cancel, or submit controls are out of scope.
- Route synchronization, persistence, validation services, and form orchestration are out of scope.
- Indicator-only steppers that do not render projected panel content are out of scope for v1.

## Public API

Import stepper primitives from the folder barrel:

```ts
import {
  StepComponent,
  StepOrientation,
  StepperComponent,
  StepTitleDirective,
} from '../../shared/ui-lib';
```

Public pieces:

- `StepperComponent` with selector `ms-stepper`
- `StepComponent` with selector `ms-step`
- `StepTitleDirective` with selector `ng-template[msStepTitle]`
- `StepOrientation` type exported from `stepper-types.ts`

Required API:

```ts
type StepOrientation = 'horizontal' | 'vertical';

class StepperComponent {
  readonly orientation = input<StepOrientation>('horizontal');
  readonly linear = input(false);
  readonly selectedIndex = model(0);
}

class StepComponent {
  readonly title = input('');
  readonly completed = input(false);
  readonly disabled = input(false);
}
```

Defaults:

- the first step is selected by default
- steppers render horizontally by default
- steppers allow free selection by default
- projected `msStepTitle` content takes precedence over the `title` input
- steps without a projected title or `title` input render an empty step label
- disabled steps cannot be selected or focused through stepper keyboard navigation

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.stepper`, `.step-list`, `.step`, `.step-marker`, `.step-label`, `.step-connector`, and `.step-panel`.

## Desired Usage

```ts
import { Component } from '@angular/core';

import { StepComponent, StepperComponent, StepTitleDirective } from './shared/ui-lib';

@Component({
  selector: 'app-stepper-example',
  imports: [StepperComponent, StepComponent, StepTitleDirective],
  template: `
    <ms-stepper>
      <ms-step title="Account" [completed]="true">
        <p>Collect account details and contact preferences.</p>
      </ms-step>

      <ms-step>
        <ng-template msStepTitle> Billing <span class="badge">Required</span> </ng-template>

        <p>Capture billing address and payment details.</p>
      </ms-step>

      <ms-step title="Review">
        <p>Review details before submitting the workflow.</p>
      </ms-step>
    </ms-stepper>

    <ms-stepper orientation="vertical" [linear]="true" [selectedIndex]="1">
      <ms-step title="Profile" [completed]="true">
        <p>Profile details are complete.</p>
      </ms-step>

      <ms-step title="Plan">
        <p>Select the plan that matches the workspace.</p>
      </ms-step>

      <ms-step title="Confirm" [disabled]="true">
        <p>Confirmation is locked until the plan step is complete.</p>
      </ms-step>
    </ms-stepper>
  `,
})
export class StepperExample {}
```

## Component Structure

The implementation lives in `src/app/shared/ui-lib/components/stepper`:

- `StepperComponent` coordinates projected steps, selected state, generated IDs, linear selection
  rules, orientation layout, and keyboard focus movement
- `StepComponent` stores a simple title input, completed and disabled state, optional projected
  title template, and projected panel content template
- `StepTitleDirective` marks a projected `ng-template` as the step label template
- `StepOrientation` lives in `stepper-types.ts`
- `index.ts` exposes the public API

`ms-stepper` renders a button-based ordered step list followed by the active step panel. Projected
`ms-step` instances are queried as children and do not render their own wrapper markup.

## Behavior

- Select the first projected step by default.
- Clicking an enabled, selectable step updates `selectedIndex` and renders that step's projected
  panel content.
- When `selectedIndex` changes from outside the component, render the matching step panel if the
  index exists and is selectable.
- If the projected step list changes and the selected index no longer exists, reset selection to
  the first available step.
- Render projected `msStepTitle` label content when present; otherwise render the `title` input.
- Render horizontal steppers as a single ordered step row with connectors between steps.
- Render vertical steppers as a stacked ordered step list with connectors between steps.
- Mark steps before the selected step as visited only through consumer-provided `completed` state;
  selection order alone does not set `completed`.
- Apply completed, current, pending, disabled, and blocked visual states.
- In default free-selection mode, any enabled step can be selected.
- When `[linear]="true"`, a future step is selectable only when every enabled prior step is
  completed.
- In linear mode, incomplete future steps remain focusable only if they are otherwise selectable;
  blocked future steps are skipped by keyboard navigation.
- Disabled steps cannot be clicked, selected, or focused through stepper keyboard navigation.
- `ArrowRight` and `ArrowLeft` move focus between selectable steps in logical inline direction for
  horizontal steppers.
- In right-to-left layout, horizontal left and right arrow behavior mirrors logical inline
  direction.
- `ArrowDown` and `ArrowUp` move focus between selectable steps for vertical steppers.
- `Home` focuses the first selectable step.
- `End` focuses the last selectable step.
- `Enter` and `Space` select the focused step when it is selectable.

## Projection and Composition Rules

- Consumers project one or more `ms-step` children inside `ms-stepper`.
- Consumers provide step panel content as default content inside each `ms-step`.
- Consumers may provide a rich label with one `<ng-template msStepTitle>`.
- Rich step labels should remain concise and non-interactive because the title is rendered inside a
  native step button.
- Consumers own all previous, next, submit, validation, and form controls inside projected panel
  content.
- Consumers can control selection externally with `[(selectedIndex)]` when panel controls need to
  advance or rewind the active step.

## Styling

Feature styles live in `src/styles/components/_stepper.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing surface, text, border, spacing, typography, radius, motion, and focus-ring tokens.
- Use logical block/inline properties so horizontal and vertical layouts mirror correctly in both
  `dir="ltr"` and `dir="rtl"`.
- Use `.stepper-horizontal` and `.stepper-vertical` as orientation modifiers on the rendered
  stepper root.
- Use connectors that visually link adjacent steps without relying on physical left or right
  placement.
- Keep current and completed markers visually distinct with token-based primary color treatments.
- Keep disabled and blocked steps visually subdued with disabled text and border tokens.
- Render completed step markers with the Material Symbols `check` ligature and `.ms-icon`.
- Add `check` to `MATERIAL_ICONS` if it is not already registered.
- Keep panel spacing responsive so vertical steppers can fit narrow containers without horizontal
  overflow.
- Keep styles reusable across future projects.

## Accessibility

- Render each step control as a native button.
- Render the step list with `role="tablist"` and an accessible orientation that matches the
  `orientation` input.
- Render each step control with `role="tab"`.
- Render the active step content with `role="tabpanel"`.
- Generate IDs and wire `aria-controls` from each step control to its panel and `aria-labelledby`
  from the panel to the selected step control.
- Set `aria-selected` on each step control.
- Set `aria-current="step"` on the selected step control.
- Set `aria-disabled="true"` on disabled or linear-blocked step controls.
- Use roving `tabindex` so the selected step is in the tab order and other selectable steps are
  reachable with arrow keys.
- Move focus only when navigation occurs through keyboard interaction.
- Hide decorative connector and completed icons from assistive technology.
- Preserve visible focus indication on step controls.

## Showcase

Add a dedicated `/stepper` page and home card demonstrating:

- horizontal stepper
- vertical stepper
- linear stepper with completed steps
- projected rich titles with `msStepTitle`
- disabled step state
- keyboard navigation, including a scoped RTL example

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Prefer reactive forms for non-trivial forms.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Public stepper primitives are exported from the stepper barrel.
- The primary usage example works as documented.
- Horizontal and vertical steppers both render.
- Simple `title` labels and projected `msStepTitle` labels both render.
- Clicking and keyboard navigation update or move through selectable steps as documented.
- Free-selection mode allows any enabled step to be selected.
- Linear mode blocks future steps until every enabled prior step is completed.
- Generated ARIA relationships connect step controls and panels.
- Styles are token-based, use logical properties, and are forwarded through the component styles
  index.
- Stepper layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- The `/stepper` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
