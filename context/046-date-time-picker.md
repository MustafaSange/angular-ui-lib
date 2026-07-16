# Feature 046: Date-Time Picker

## Goal

Create a composed Angular 22 control for workflows that require both a local calendar date and a
local wall-clock time without introducing implicit time-zone conversion.

## Public API

```ts
import { DateTimePickerComponent, DateTimePickerValue } from './shared/ui-lib';

type DateTimePickerValue = string | null;
```

- `DateTimePickerComponent` uses selector `ms-date-time-picker` and implements
  `FormValueControl<DateTimePickerValue>`.
- `value` defaults to `null`; non-null values use canonical local `YYYY-MM-DDTHH:mm` or
  `YYYY-MM-DDTHH:mm:ss` according to `timePrecision`.
- `dateDisplayFormat` defaults to `dd-MM-yyyy`; `timeDisplayFormat` defaults to `24-hour`.
- Date inputs include `minDate`, `maxDate`, `disabledDate`, `firstDayOfWeek`, and `locale`.
- Time inputs include `timePrecision`, `minTime`, `maxTime`, `minuteStep`, and `secondStep`.
- Shared inputs include placeholders, disabled, readonly, required, clearable, name, id, ARIA group
  labeling, and independent date/time accessible labels.

## Desired Usage

```html
<ms-signal-form-field>
  <label id="appointment-label">Appointment</label>
  <ms-date-time-picker
    [formField]="appointmentField"
    aria-labelledby="appointment-label"
    [minuteStep]="15"
  />
</ms-signal-form-field>
```

```ts
const value: DateTimePickerValue = '2026-07-14T14:30';
```

Applications combine this local value with an explicit time zone when creating an instant. The
component must not create a JavaScript `Date` or convert to UTC.

## Component Structure and Behavior

The implementation lives in `src/app/shared/ui-lib/components/date-time-picker`. It composes the
public date and time picker components and forwards their configuration without duplicating parsing,
calendar, popup, or keyboard logic.

- The public model remains one scalar value. The component splits it into internal date and time
  parts for its child controls and combines both valid parts back into `YYYY-MM-DDTHH:mm` or
  `YYYY-MM-DDTHH:mm:ss` according to the configured time precision.
- Partial entry remains in the internal raw `transformedValue()` state and does not replace the last
  valid public model. A missing date or time reports a specific required error.
- Clearing both internal parts writes `null` to the public model.
- Child date/time parse errors are forwarded through the composed control's `transformedValue()`
  integration so the parent `[formField]` becomes invalid and its message container displays the
  specific child error.
- `touch` forwards interaction from either child control.
- `focus()` focuses the date input; `reset()` clears both members.
- `name` produces one hidden native form value containing the canonical scalar date-time.
- Disabled, readonly, required, clearable, constraints, formats, locale, and ARIA descriptions are
  consistently forwarded to both controls. Disabled mode makes both child inputs and actions
  unavailable. Readonly mode leaves both values focusable for reading while preventing editing,
  clearing, and popup opening; neither state changes the canonical scalar model. The group host
  exposes `aria-disabled` or `aria-readonly`, and a disabled named control disables its hidden form
  value so native form submission omits it.

## Styling and Accessibility

Styles live in `src/styles/components/_date-time-picker.scss`. The two controls share one dense
form-field surface with a logical separator, inherit the global or local density tokens, mirror in
RTL, and stack responsively on narrow viewports. Default density is 28px; compact density is 24px.
The host is an accessible group; consumers provide a group label while child inputs have independent
`Date` and `Time` names by default.

## Showcase

The `/date-time-pickers` showcase demonstrates a composed appointment value, partial completion,
constraints, and responsive/RTL layout with a complete standalone copyable snippet.

## Angular Rules

- Use standalone APIs, signals, `FormValueControl`, composition, host metadata, and strict types.
- Do not add `standalone: true`, explicit default change detection, implicit time-zone behavior, or
  tests.

## Acceptance Criteria

- The component and scalar value type are exported from public barrels.
- A complete selection writes one canonical local date-time value at the configured precision;
  clearing both parts writes `null`.
- Partial entry retains the last valid model and reports an error without leaking an incomplete
  public value.
- No time-zone conversion occurs.
- Form-field integration, keyboard/focus behavior, disabled/readonly forwarding, RTL, responsive
  layout, and accessible grouping work as documented.
- The matching showcase compiles and the Angular build succeeds.
