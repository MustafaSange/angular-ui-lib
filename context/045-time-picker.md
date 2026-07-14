# Feature 045: Time Picker

## Goal

Create an accessible Angular 22 time-only form control with manual entry and a selectable time list,
while keeping its model independent from dates and time zones.

## Public API

```ts
import {
  TimePickerComponent,
  TimePickerDisplayFormat,
  TimePickerPrecision,
  TimePickerValue,
} from './shared/ui-lib';
```

- `TimePickerComponent` uses selector `ms-time-picker` and implements
  `FormValueControl<TimePickerValue>`.
- `TimePickerValue` is `string | null`; non-null values use canonical 24-hour `HH:mm` for minute
  precision or `HH:mm:ss` for second precision.
- `TimePickerDisplayFormat` is `'24-hour' | '12-hour'`.
- `TimePickerPrecision` is `'minute' | 'second'` and defaults to `minute`.
- `displayFormat` defaults to `24-hour`; it controls visible text and manual parsing, not the model.
- `minuteStep` and `secondStep` default to `1`, generate their respective selector options, and
  fall back to `1` when outside the supported `1` through `59` range.
- `minTime` and `maxTime` accept canonical `HH:mm` limits without conflicting with Signal Forms'
  reserved native constraint bindings.
- `placeholder`, `disabled`, `readonly`, `required`, `clearable`, `name`, `id`, ARIA labeling,
  `value`, `open`, and `touch` parallel the date picker APIs.
- `parseErrorChange` emits the current manual-entry error for composed-control integration; normal
  consumers receive the same error automatically through `[formField]`.

## Desired Usage

```html
<ms-signal-form-field>
  <label for="start-time">Start time</label>
  <ms-time-picker id="start-time" [formField]="timeField" [minuteStep]="15" />
</ms-signal-form-field>
```

The model stores `14:30`. With `displayFormat="12-hour"`, the same value displays and accepts
`02:30 PM`. With `precision="second"`, the model stores `14:30:45` and displays `02:30:45 PM`.

## Component Structure and Behavior

The implementation lives in `src/app/shared/ui-lib/components/time-picker`, with public component
types and internal pure parsing/formatting helpers.

- Opening uses the native Popover API, initializes the inline selectors from the current value, and
  focuses the hour selector.
- Manual input uses Angular's `transformedValue()` and follows the active display format; empty
  input clears the value. Invalid or out-of-range text is retained with `aria-invalid="true"`
  without replacing the valid model, and its parse error is reported to the nearest `[formField]`.
- The popup renders inline native selectors for hour and minute, conditionally renders second for
  second precision, and conditionally renders AM/PM for 12-hour display.
- Changing a selector immediately updates the canonical value. Done marks the field touched, closes
  a valid selection, and restores input focus.
- Native selector keyboard behavior remains available, and Escape closes the popup.
- Disabled mode disables the text input and popup action, hides clearing, and closes an open popup.
  Readonly mode keeps the current text focusable for reading but prevents typing, clearing, and
  opening; its popup action uses `aria-disabled` so readonly styling is not conflated with disabled
  styling by the surrounding form field. The component host also reflects these states with
  `aria-disabled` and `aria-readonly`.
- This control represents local wall-clock time only and performs no UTC or time-zone conversion.

## Styling and Accessibility

Styles live in `src/styles/components/_time-picker.scss`, use tokens and logical properties, and
fit the 28px dense form-field control. The popup uses dialog semantics, visible labels for each time
part, native select behavior, accessible icon buttons, and visible focus treatment. Outer
form-field required state applies only to the main field label; it does not add required markers to
the internal selector labels. Hour/minute/second separators align vertically with the selector
controls.

## Showcase

The `/date-time-pickers` showcase demonstrates 24-hour Signal Forms entry; a 12-hour, second-precision
picker with hour/minute/second/AM-PM selectors; one-minute precision with `[minuteStep]="1"`;
constraints; and RTL behavior with matching standalone copyable snippets.

## Angular Rules

- Use standalone APIs, signals, `FormValueControl`, host metadata, native control flow, and strict
  TypeScript.
- Do not add `standalone: true`, explicit default change detection, or tests.

## Acceptance Criteria

- Public APIs are exported through feature and root barrels.
- Manual and selector entry synchronize a canonical `HH:mm | null` or `HH:mm:ss | null` value based
  on precision.
- Display-format changes never alter the model semantics.
- Invalid manual input displays its specific parse or range message through the surrounding
  `ms-signal-form-field` after the field is touched or dirty.
- Constraints, partial/invalid entry, keyboard, focus, disabled, readonly, and RTL behavior work as
  documented.
- Matching showcase examples compile and the Angular build succeeds.
