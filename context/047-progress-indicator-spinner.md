# Feature 047: Progress Indicator and Spinner

## Goal

Create reusable, accessible progress primitives for determinate task completion and indeterminate
loading. The feature provides a linear progress indicator and a circular spinner with consistent
sizes, semantic colors, reduced-motion behavior, and RTL-safe layout.

## Non-Goals

- The components do not own async work, timers, polling, cancellation, or loading state.
- Circular determinate progress and buffered/segmented linear progress are out of scope for v1.
- Labels, percentages, and surrounding status text remain consumer-owned content.

## Public API

Import public pieces from the folder barrel or the top-level UI library barrel:

```ts
import {
  ProgressIndicatorComponent,
  ProgressKind,
  ProgressSize,
  SpinnerComponent,
} from './shared/ui-lib';
```

Public pieces:

- `ProgressIndicatorComponent` with selector `ms-progress-indicator`
- `SpinnerComponent` with selector `ms-spinner`
- `ProgressKind` type: `'primary' | 'success' | 'warning' | 'danger' | 'inherit'`
- `ProgressSize` type: `'sm' | 'md' | 'lg'`

Required API:

```ts
class ProgressIndicatorComponent {
  readonly value = input<number | null>(null);
  readonly max = input(100);
  readonly size = input<ProgressSize>('md');
  readonly kind = input<ProgressKind>('primary');
  readonly ariaLabel = input('Progress');
  readonly ariaLabelledby = input('');
  readonly ariaValueText = input('');
}

class SpinnerComponent {
  readonly size = input<ProgressSize>('md');
  readonly kind = input<ProgressKind>('primary');
  readonly ariaLabel = input('Loading');
}
```

`null` progress is indeterminate. Finite numeric values are determinate, clamped from zero through
the effective maximum, and converted to a percentage for the visual fill. A non-finite value is
treated as indeterminate. A non-finite or non-positive maximum falls back to `100`.

An empty spinner `ariaLabel` makes the spinner decorative, removes its status role, and hides it
from assistive technology. This is useful when adjacent text already communicates loading.

## Desired Usage

Determinate progress:

```html
<ms-progress-indicator
  [value]="completed"
  [max]="total"
  ariaLabel="Files uploaded"
  [ariaValueText]="completed + ' of ' + total + ' files'"
/>
```

Indeterminate loading:

```html
<div class="loading-row">
  <ms-spinner ariaLabel="Loading account details" />
  <span>Loading account details…</span>
</div>
```

Decorative inline spinner:

```html
<button class="btn btn-primary" type="button" disabled>
  <ms-spinner size="sm" kind="inherit" ariaLabel="" />
  Saving…
</button>
```

## Component Structure

The implementation lives in `src/app/shared/ui-lib/components/progress-indicator`:

- `ProgressIndicatorComponent` normalizes progress values and renders the semantic linear track
- `SpinnerComponent` renders an indeterminate circular status indicator
- `progress-indicator-types.ts` contains the shared public size and kind types
- `index.ts` exposes the public API

Neither component projects content. Consumers compose labels and status text beside the primitive.
Internal styling hooks are `.progress-indicator`, `.progress-indicator-fill`, `.spinner`, and
`.spinner-circle`.

## Behavior

- `ms-progress-indicator` renders determinate progress when `value` is finite and indeterminate
  progress when `value` is `null` or non-finite.
- Determinate values are clamped to the range from zero through the effective maximum.
- Determinate fill transitions when the value changes. Indeterminate progress uses a repeating
  logical inline sweep.
- `ms-spinner` is always visually indeterminate.
- Size and kind changes update presentation without changing semantics.
- `kind="inherit"` uses the surrounding text color for inline composition.
- The components contain no timers or subscriptions and require no lifecycle cleanup.

## Styling

Feature styles live in `src/styles/components/_progress-indicator.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing theme, spacing, border, radius, and transition tokens.
- Linear sizes are 2px, 4px, and 8px using spacing tokens; spinner sizes are 16px, 24px, and 32px.
- Render spinners as a 30%-strength complete ring with one bright leading border segment and an
  800ms rotation.
- Use logical sizing and placement so determinate and indeterminate bars originate at inline-start
  and mirror in RTL.
- Use component-private custom properties prefixed with `--_progress-*`.
- Disable non-essential progress and spinner animation under `prefers-reduced-motion: reduce`; the
  static indicator remains visible.

## Accessibility

- Linear progress uses `role="progressbar"`, `aria-valuemin="0"`, and the effective
  `aria-valuemax`.
- Determinate progress exposes clamped `aria-valuenow`; indeterminate progress omits it.
- `ariaValueText` overrides the numeric announcement when provided.
- `ariaLabelledby` takes precedence over `ariaLabel` for naming linear progress.
- A spinner with a non-empty `ariaLabel` uses `role="status"` and renders the label as visually
  hidden live-region text.
- A spinner with an empty `ariaLabel` is decorative and uses `aria-hidden="true"`.
- Visual motion is never the only source of task meaning; consumers retain visible surrounding
  status text where the context requires it.

## Showcase

Add a dedicated `/progress` page and home card demonstrating:

- interactive determinate progress
- indeterminate linear progress
- semantic kinds and all sizes
- visibly labeled spinner sizes and semantic kinds, with guidance that semantic color should match
  the operation context
- a decorative inherited-color spinner composed inside a disabled button
- RTL progress layout

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode` from `src/app/shared/showcase-code`.

## Angular Rules

- Use standalone Angular APIs without `standalone: true`.
- Rely on Angular 22 default OnPush change detection.
- Use signal inputs and computed state.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Both components and their public types are exported from feature and top-level barrels.
- Determinate values, clamping, custom maxima, and indeterminate state work as documented.
- ARIA values and accessible names match visual state.
- Spinner status and decorative modes work as documented.
- Sizes and semantic kinds are token-based; inherited color works in composed controls.
- Linear progress mirrors in LTR and RTL.
- Reduced-motion users receive static visible indicators.
- The `/progress` showcase and home card are available with matching copyable snippets.
- The Angular build succeeds.
