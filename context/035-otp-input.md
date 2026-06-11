# Feature 035: OTP Input

## Goal

Create a reusable one-time-code input for verification, recovery, and short confirmation codes.

The component must support configurable code length, numeric or alphanumeric entry, paste
distribution, model binding, signal-form integration, disabled and readonly states, and a completion
event that consumers can use to submit when the configured length is reached.

## Public API

Import OTP input primitives from the folder barrel:

```ts
import { OtpInputComponent, OtpInputMode } from '../../shared/ui-lib';
```

Public pieces:

- `OtpInputComponent` with selector `ms-otp-input`
- `OtpInputMode` helper type: `'numeric' | 'alphanumeric'`

Required API:

```ts
class OtpInputComponent {
  readonly value = model('');
  readonly length = input(6, { transform: numberAttribute });
  readonly mode = input<OtpInputMode>('numeric');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly id = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });
  readonly complete = output<string>();
  readonly touch = output<void>();

  focus(options?: FocusOptions): void;
  reset(): void;
}
```

Defaults:

- `value` is `''`
- `length` is `6`, with an effective supported range of `1` to `12`
- `mode` is `'numeric'`
- `disabled` and `readonly` are `false`
- ARIA label inputs default to `null`

`OtpInputComponent` implements Angular signal forms `FormValueControl<string>`. It does not provide a
`ControlValueAccessor`.

## Desired Usage

Numeric OTP with completion handling:

```ts
import { Component, signal } from '@angular/core';

import { OtpInputComponent } from './shared/ui-lib';

@Component({
  selector: 'app-otp-example',
  imports: [OtpInputComponent],
  template: `
    <ms-otp-input
      [(value)]="code"
      length="6"
      aria-label="Verification code"
      (complete)="submitCode($event)"
    />
  `,
})
export class OtpExample {
  protected readonly code = signal('');

  protected submitCode(code: string): void {
    console.log(code);
  }
}
```

Alphanumeric recovery code:

```ts
import { Component, signal } from '@angular/core';

import { OtpInputComponent } from './shared/ui-lib';

@Component({
  selector: 'app-recovery-code-example',
  imports: [OtpInputComponent],
  template: `
    <ms-otp-input
      [(value)]="recoveryCode"
      length="8"
      mode="alphanumeric"
      aria-label="Recovery code"
    />
  `,
})
export class RecoveryCodeExample {
  protected readonly recoveryCode = signal('');
}
```

Signal form-field binding:

```ts
import { Component, signal } from '@angular/core';
import { FormField, form, minLength, schema } from '@angular/forms/signals';

import { OtpInputComponent, SignalFormField, SignalFormHint } from './shared/ui-lib';

type VerificationForm = {
  code: string;
};

@Component({
  selector: 'app-form-field-otp-example',
  imports: [FormField, OtpInputComponent, SignalFormField, SignalFormHint],
  template: `
    <ms-signal-form-field>
      <label id="code-label">Verification code</label>
      <ms-otp-input [formField]="codeField" length="6" aria-labelledby="code-label" />
      <ms-hint>Paste or type the 6-digit code.</ms-hint>
    </ms-signal-form-field>
  `,
})
export class FormFieldOtpExample {
  private readonly model = signal<VerificationForm>({
    code: '',
  });

  protected readonly form = form(
    this.model,
    schema<VerificationForm>((path) => {
      minLength(path.code, 6);
    }),
  );

  protected readonly codeField = this.form.code;
}
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/otp-input`

The feature includes:

- `OtpInputComponent`
- `OtpInputMode`
- `otp-input.html`
- `index.ts`

Styles live in:

`src/styles/components/_otp-input.scss`

The showcase lives in:

`src/app/features/otp-input`

## Behavior

- The component represents a single string value.
- The effective length is clamped from `1` to `12`.
- Numeric mode accepts only `0-9`.
- Alphanumeric mode accepts ASCII `A-Z` and `0-9`; letters are normalized to uppercase.
- User typing a valid character fills the focused slot and advances focus.
- Invalid typed characters are ignored.
- Backspace clears the current slot, or moves backward and clears the previous slot when the current
  slot is empty.
- Delete clears the current slot.
- ArrowLeft and ArrowRight move between slots.
- Home and End move to the first and last slots.
- Keyboard shortcuts using Control, Meta, or Alt are not intercepted, so browser and operating
  system actions such as paste can run normally.
- Paste filters invalid characters, normalizes valid characters, fills from the focused slot, and
  truncates to the effective length.
- External `value` changes are normalized, filtered, and truncated to the effective length without
  emitting completion.
- User typing or paste emits `complete(value)` when the value reaches the effective length.
- Disabled controls disable all visible inputs and prevent editing.
- Readonly controls keep focusability and value visibility while preventing edits.
- Blur emits `touch` after user interaction when focus leaves the component.
- `focus()` moves focus to the next empty slot, or the last slot when full.
- `reset()` clears the value and focuses the first slot.
- When `name` is provided, a hidden input with the joined value is rendered for native form
  submission.

## Styling

- Use `.otp-input`, `.otp-group`, and `.otp-cell` as internal styling hooks.
- Use design tokens for colors, borders, radius, spacing, typography, motion, and focus rings.
- Use logical sizing and spacing so the component mirrors correctly in RTL contexts.
- OTP cells render as stable square blocks using `--control-height-lg` for both inline and block
  size.
- Cell text uses `--font-size-xl` so digits and letters visually balance with the square block size.
- When placed inside `ms-signal-form-field`, the OTP component shrink-wraps to the square cell group
  instead of stretching into a full-width rectangular text-field shell.
- Signal form-field OTP layouts remove the outer form-field control border/background so each OTP
  cell remains the visible input affordance.
- Use visible token-based focus styling on each input.
- Disabled and readonly states should be visually distinct from the default editable state.

## Accessibility

- Render native text inputs so focus, selection, mobile keyboard, and assistive technology behavior
  remain platform-aligned.
- Wrap the inputs in a `role="group"` container.
- Consumers must provide an accessible name with `aria-label` or `aria-labelledby`.
- When only `aria-label` is provided, each slot receives a positional label such as
  "Verification code character 1 of 6".
- Forward `aria-describedby` to the group and slots.
- Use `inputmode="numeric"` and numeric pattern in numeric mode.
- Use `autocomplete="one-time-code"` on the first slot.
- Preserve clear keyboard focus indicators.

## Showcase

Add a dedicated `/otp-input` page and home card demonstrating:

- 6-digit numeric OTP with `(complete)`
- 4-character alphanumeric code
- 8-digit paste-friendly recovery code
- signal form-field integration with `[formField]`
- disabled and readonly states

Each visual example must have a nearby `ShowcaseCode` snippet. Snippets must import public APIs from
`./shared/ui-lib` and match the rendered behavior.

## Acceptance Criteria

- public API exported from the shared UI library barrel
- examples compile unchanged
- numeric and alphanumeric modes filter and normalize correctly
- paste behavior fills from the focused slot and truncates at the configured length
- paste through keyboard shortcuts works because modifier-key shortcuts are not intercepted
- completion event emits only for user-driven completed values
- signal form-field binding works with `[formField]`
- signal form-field layout displays a compact group of square OTP cells, not a stretched rectangle
- styling follows project conventions and is RTL-safe
- accessibility labels, focus, disabled, and readonly behavior are implemented
