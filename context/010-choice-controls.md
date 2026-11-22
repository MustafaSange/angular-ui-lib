# Feature 010: Choice Controls

## Goal

Create reusable projected choice controls for checkbox, radio, and switch inputs while keeping consumers in control of the native input and label.

## Public API

Import choice controls from the folder barrel:

```ts
import {
  CheckboxControl,
  CheckboxGroup,
  ChoiceError,
  ChoiceHint,
  RadioControl,
  RadioGroup,
  SwitchControl,
  SwitchGroup,
} from '../../shared/ui-lib';
```

Components:

- `CheckboxGroup` with selector `ms-checkbox-group`
- `CheckboxControl` with selector `ms-checkbox-control`
- `RadioGroup` with selector `ms-radio-group`
- `RadioControl` with selector `ms-radio-control`
- `SwitchGroup` with selector `ms-switch-group`
- `SwitchControl` with selector `ms-switch-control`
- `ChoiceHint` with selector `ms-choice-hint`
- `ChoiceError` with selector `ms-choice-error`

Shared reusable components use the `ms-` selector prefix. Do not use `app-` for components under `src/app/shared`.

## Desired Usage

Checkbox:

```html
<ms-checkbox-group>
  <legend>Notifications</legend>

  <ms-checkbox-control>
    <input type="checkbox" checked />
    <label>Email updates</label>
    <ms-choice-hint>Send product and release notes.</ms-choice-hint>
  </ms-checkbox-control>

  <ms-checkbox-control>
    <input type="checkbox" />
    <label>Terms agreement</label>
    <ms-choice-error>Accept the terms before continuing.</ms-choice-error>
  </ms-checkbox-control>
</ms-checkbox-group>
```

Radio:

```html
<ms-radio-group>
  <legend>Support plan</legend>

  <ms-radio-control>
    <input type="radio" name="support-plan" value="growth" checked />
    <label>Growth</label>
    <ms-choice-hint>Priority support for active teams.</ms-choice-hint>
  </ms-radio-control>
</ms-radio-group>
```

Switch:

```html
<ms-switch-group>
  <legend>Preferences</legend>

  <ms-switch-control variant="classic">
    <input type="checkbox" role="switch" checked />
    <label>Notifications</label>
    <ms-choice-hint>Push critical alerts immediately.</ms-choice-hint>
  </ms-switch-control>
</ms-switch-group>
```

### Switch Variants and Colors

The public `SwitchVariant` type accepts `'classic'` and `'slim-track'`. Classic keeps the thumb
inside the track. Slim Track centers a 24px thumb over a 16px track, with 4px of overhang above and
below. If you omit `variant`, the switch uses `provideUiLib({ switch: { variant: … } })` and
falls back to Classic when no global variant is configured.

Both variants accept `kind="success"`, `"warning"`, `"danger"`, or `"info"` for a solid
selected track and a contrasting thumb. Without a kind, both variants use a solid theme accent
track and its contrasting thumb color.
Set `selectedTrackColor` or `selectedThumbColor` to a CSS color or theme variable to override
the corresponding selected color.

```ts
provideUiLib({
  switch: { variant: 'slim-track', kind: 'success' },
});
```

The public `SwitchConfig` type supports the same four options as the component. A switch can
override each option independently. Configured explicit colors take precedence over the
semantic palette, including when a switch overrides the global kind.

Label-before layout:

```html
<ms-checkbox-control slot="label-before">
  <input type="checkbox" />
  <label>Email updates</label>
  <ms-choice-hint>Places text before the checkbox.</ms-choice-hint>
</ms-checkbox-control>
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/choice-controls`

Each component has its own folder and local barrel:

- `checkbox-group/`
- `checkbox-control/`
- `radio-group/`
- `radio-control/`
- `switch-group/`
- `switch-control/`
- `choice-hint/`
- `choice-error/`
- `index.ts`

The top-level `index.ts` must export from the component folders so public imports stay stable.

## Projection Rules

- Do not use inputs for label, hint, error, checked, disabled, name, or value.
- Consumers project native `input` and `label`.
- Consumers project `ms-choice-hint` or `ms-choice-error` for support text.
- Checkbox and radio controls add the `.choice-input` class to the projected native input.
- Switch controls add the `.switch-input` class to the projected native checkbox input.
- Switch controls render the visual `.switch-track` and `.switch-thumb` internally.
- Switch controls link both the projected text label and the visual switch track to the projected input.
- If the consumer does not provide an input `id` or label `for`, the control component should generate/link them.
- Default layout places the input or switch track before the label/support text.
- Add `slot="label-before"` to `ms-checkbox-control`, `ms-radio-control`, or `ms-switch-control` to place label/support text before the input or switch track.
- "Before" follows logical inline order: layouts mirror naturally when the nearest direction is
  `dir="rtl"`.
- Choice control components should apply the `is-label-before` class with `@Component` `host` metadata, not `@HostBinding`.
- Do not implement `ControlValueAccessor` unless the project explicitly asks for forms integration.

## Styling

Choice control styles live in:

`src/styles/components/_choice-controls.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Do not put choice-control styles in `_form-fields.scss`.

Styling rules:

- Use existing tokens for color, spacing, radius, border width, motion, and focus rings.
- Checked checkbox and radio states use accent colors. Checked switches use the configured
  colors, the semantic palette, or the theme accent.
- Checkbox and radio controls use `var(--border-width-md)`.
- Checkbox, radio, and switch labels use the same muted compact label treatment as form-field
  labels: `--font-size-sm` (14px) text with `--color-text-muted`.
- `ms-choice-hint` and `ms-choice-error` use the same font size as form field hint/error messages.
- Disabled controls must use `cursor: not-allowed`.
- Disabled switches use muted track and thumb colors, including when checked. The thumb position
  still shows whether the switch is on or off.
- The visible switch track must use `cursor: pointer` and remain clickable.
- `.is-label-before` on the control host owns the reversed grid layout.
- Checkbox, radio, switch, and label-before arrangements use logical inline layout in both
  `dir="ltr"` and `dir="rtl"`.
- A checked switch thumb moves toward inline-end rather than a fixed physical side.

## Showcase

Choice controls have dedicated showcase pages at `/checkbox`, `/radio`, and `/switch`.
The Compare Variants section pairs Classic and Slim Track with the same color and on, off,
and disabled examples. The columns stack when space is limited.
Classic and Slim Track show the same checked, unchecked, disabled, error, and label-before
examples. The Disabled Slim Track section compares disabled off and on with the same semantic
color setting. The semantic color section shows both variants, including inherited settings and
per-switch overrides.

Keep a matching `<app-showcase-code>` snippet directly below each demo. Use the projected
component API in snippets.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Keep strict TypeScript.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Choice controls render with projected native `input` and `label`.
- `legend` is projected into the semantic group fieldset.
- Hints and errors render through `ms-choice-hint` and `ms-choice-error`.
- Checkbox, radio, and switch checked, unchecked, disabled, and error examples are visible in their showcases.
- `slot="label-before"` renders label/support text before the input or switch track.
- The switch can be toggled by clicking either its text label or visual track.
- Checked switches and label-before arrangements mirror correctly in `dir="rtl"`.
- Choice-control SCSS remains separated from form-field SCSS.
