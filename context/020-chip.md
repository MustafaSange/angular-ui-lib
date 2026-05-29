# Feature 020: Chip

## Goal

Create a reusable chip primitive for compact labels, filters, and removable token values. Chips
may be static, selected, removable, or disabled while keeping consumers in control of projected
label and leading content.

## Public API

Import chip primitives from the folder barrel:

```ts
import {
  ChipComponent,
  ChipRemoveDirective,
} from '../../shared/components/chip';
```

Public pieces:

- `ChipComponent` with selector `ms-chip`
- `ChipRemoveDirective` with selector `button[msChipRemove]`

Required API:

```ts
type ChipVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type ChipAppearance = 'soft' | 'outline';

class ChipComponent {
  readonly variant = input<ChipVariant>('neutral');
  readonly appearance = input<ChipAppearance>('soft');
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly removable = input(false);
  readonly removed = output<void>();
}
```

Defaults:

- chips use the neutral soft treatment
- chips are not selected, disabled, or removable unless configured
- removable chips emit `removed` when their remove button is activated

Shared reusable components use the `ms-` selector prefix. Internal styling hooks are `.chip`,
`.chip-content`, `.chip-leading`, `.chip-remove`, and `.chip-remove-icon`.

## Desired Usage

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ChipComponent, ChipRemoveDirective } from './shared/components/chip';

@Component({
  selector: 'app-chip-example',
  imports: [ChipComponent, ChipRemoveDirective],
  template: `
    <ms-chip>Design system</ms-chip>
    <ms-chip variant="info" [selected]="true">Selected filter</ms-chip>
    <ms-chip variant="success">
      <span class="ms-icon" aria-hidden="true">check_circle</span>
      Published
    </ms-chip>

    @if (showRemovable()) {
      <ms-chip removable (removed)="showRemovable.set(false)">
        Angular
        <button type="button" msChipRemove aria-label="Remove Angular"></button>
      </ms-chip>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipExample {
  readonly showRemovable = signal(true);
}
```

## Component Structure

The implementation lives in `src/app/shared/components/chip`:

- `ChipComponent` renders projected chip content, selected/disabled state, and optional removable
  behavior
- `ChipRemoveDirective` marks the projected remove button and coordinates remove activation with
  the nearest chip
- `chip-types.ts` defines `ChipVariant` and `ChipAppearance`
- `index.ts` exposes the public API

`ms-chip` renders host-level inline markup. Consumers own the projected label text and any
projected leading icon or avatar content.

## Behavior

- Chips are non-interactive by default unless the consumer projects interactive controls.
- Selected chips apply a distinct selected visual state.
- Disabled chips apply disabled styling and suppress remove behavior.
- Removable chips require a projected native `button[msChipRemove]`.
- Activating an enabled `button[msChipRemove]` emits the parent chip `removed` output.
- Pressing `Enter` or `Space` on the remove button activates removal through native button
  behavior.

## Projection and Composition Rules

- Consumers provide chip labels through default content projection.
- Consumers may project an icon or avatar before chip text.
- Projected Material Symbols icons must use `.ms-icon` or `.ms-icon-filled`.
- Consumers should project one native remove button with `msChipRemove` when `removable` is true.
- The chip remove directive should render or decorate a remove icon internally so consumers do not
  need to provide a Material Symbols ligature for the remove affordance.
- Do not use inputs for label text.
- Do not implement `ControlValueAccessor`; chips are display and token primitives, not form
  controls.

## Styling

Feature styles live in `src/styles/components/_chip.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing color, surface, border, spacing, radius, typography, motion, and focus-ring tokens.
- Use logical block/inline properties so leading content and remove buttons mirror correctly in
  both `dir="ltr"` and `dir="rtl"`.
- Keep chips large enough for comfortable remove-button targeting.
- `soft` uses a subtle surface with optional selected emphasis.
- `outline` uses a transparent surface with a visible border.
- In dark mode, chip text should match the alert/toast tone model: mix
  `var(--color-text-primary)` at 78% with the chip variant color for readable, restrained
  variant-tinted text. Selected chip text uses the same dark-mode mix.
- Disabled chips reduce contrast, use `cursor: not-allowed`, and keep remove controls inactive.
- Render the chip remove icon with `.ms-icon`.
- Add any new Material Symbols ligature name used by the implementation to `MATERIAL_ICONS`.
- Name component-private CSS custom properties with a `--_chip-*` prefix.
- Keep styles reusable across future projects.

## Accessibility

- Render chip labels as readable text content.
- Use `aria-disabled="true"` on disabled chips when the host itself is not a native disabled
  element.
- Render chip removal as a native button with an accessible name.
- Hide decorative projected icons from assistive technology when they do not convey additional
  meaning.
- Preserve visible focus indication on projected remove buttons.
- Do not make the chip host focusable unless a future selectable-chip pattern explicitly requires
  keyboard selection behavior.

## Showcase

Add a dedicated `/chip` page and home card demonstrating:

- static chips with text
- chips with leading icons
- chip variants: neutral, info, success, warning, and danger
- chip appearances: soft and outline
- selected chips
- removable chips
- disabled chips
- a scoped RTL example showing leading content and remove-button mirroring

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Use `ChangeDetectionStrategy.OnPush`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Public chip primitives are exported from the chip barrel.
- The primary chip usage example works as documented.
- Chips render static, leading-icon, selected, removable, and disabled examples.
- Removable chips emit `removed` only when enabled.
- Remove buttons are native buttons with accessible names and visible focus.
- Styles are token-based, use logical properties, and are forwarded through the component styles
  index.
- Leading content and chip remove buttons mirror correctly in RTL layouts.
- The `/chip` route and home card expose copyable demonstrations of core behavior.
- No tests are added or updated for this feature.
