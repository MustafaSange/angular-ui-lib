# Feature 044: Date Picker

## Goal

Create an accessible Angular 22 date-only form control with manual entry and a calendar popover.
The control presents configurable date formats while preserving an unambiguous ISO date-only model.

## Public API

```ts
import {
  DatePickerComponent,
  DatePickerDisabledDate,
  DatePickerDisplayFormat,
  DatePickerValue,
} from './shared/ui-lib';
```

- `DatePickerComponent` uses selector `ms-date-picker` and implements
  `FormValueControl<DatePickerValue>`.
- `DatePickerValue` is `string | null`; non-null values use `YYYY-MM-DD`.
- `DatePickerDisplayFormat` is `'dd-MM-yyyy' | 'yyyy-MM-dd' | 'MM-dd-yyyy'`.
- `DatePickerDisabledDate` receives an ISO date and returns whether it is unavailable.

Inputs and models:

- `value` defaults to `null`; `open` defaults to `false`.
- `displayFormat` defaults to `dd-MM-yyyy` and controls visible text and manual parsing.
- `placeholder` defaults from the format, producing `DD-MM-YYYY` initially.
- `minDate`, `maxDate`, and `disabledDate` limit selectable dates without conflicting with Signal
  Forms' reserved native constraint bindings.
- `firstDayOfWeek` accepts `0` through `6` and defaults to Sunday (`0`).
- `locale` controls `Intl.DateTimeFormat` month, weekday, and accessible day labels.
- `disabled`, `readonly`, `required`, `clearable`, `name`, `id`, and ARIA label inputs follow
  existing dense form-control conventions.
- `touch` emits after committed interaction.
- `parseErrorChange` emits the current manual-entry error for composed-control integration; normal
  consumers receive the same error automatically through `[formField]`.

## Desired Usage

```ts
import { Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';
import { DatePickerComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-date-example',
  imports: [DatePickerComponent, FormField, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="start-date">Start date</label>
      <ms-date-picker id="start-date" [formField]="dateField" />
    </ms-signal-form-field>
  `,
})
export class DateExample {
  private readonly model = signal({ date: null as string | null });
  protected readonly form = form(
    this.model,
    schema<{ date: string | null }>((path) => {
      required(path.date);
    }),
  );
  protected readonly dateField = this.form.date;
}
```

Manual input displays `14-07-2026` by default while the bound value is `2026-07-14`.

## Component Structure and Behavior

The implementation lives in `src/app/shared/ui-lib/components/date-picker` and contains the public
component and types plus internal pure date parsing, formatting, arithmetic, and month-grid helpers.
The calendar remains internal in v1 and is not exported as `ms-calendar`.

- Opening uses the native Popover API with logical anchor placement and focuses the active day.
- Calendar selection updates the ISO value, formats the input, closes the panel, and restores input
  focus.
- Manual input uses Angular's `transformedValue()` with the display text as its raw value. Empty
  input clears the value. Invalid, out-of-range, or unavailable input retains the last valid model
  value, sets `aria-invalid="true"`, and reports a specific parse error to the nearest `[formField]`.
- Changing `displayFormat` reformats valid display text without changing the model.
- The month and year in the calendar header are separate controls. Choosing the month opens a
  12-month grid; choosing the year opens a 12-year grid. Selecting a year returns to the month grid,
  and selecting a month returns to the day grid without changing the model until a day is chosen.
- Previous/next navigation moves by one month in the day grid, one year in the month grid, and one
  12-year page in the year grid. Each grid supports arrow keys, Home/End, Page Up/Page Down,
  Enter/Space activation, and Escape.
- Disabled mode disables the text input and calendar action, hides clearing, and closes an open
  popover. Readonly mode keeps the current text focusable for reading but prevents typing, clearing,
  and calendar opening; its calendar action uses `aria-disabled` so the surrounding form field does
  not incorrectly apply disabled styling. The component host also reflects these states with
  `aria-disabled` and `aria-readonly`.
- `minDate`, `maxDate`, and predicate-disabled days cannot be selected. Unavailable day, month, and
  year choices use `aria-disabled` plus guarded activation instead of native `disabled`, allowing
  roving keyboard focus without making the surrounding form field appear disabled.
- The month grid always renders six weeks so the popover size remains stable.

## Styling and Accessibility

Styles live in `src/styles/components/_date-picker.scss`, are forwarded from the component style
index, use existing tokens and logical properties, and keep the projected control at the shared
small-control height: 28px in default density and 24px in compact density. Calendar hooks are
concise and unprefixed.

The text input exposes its label relationships, expanded state, dialog relationship, invalid state,
and format placeholder. The calendar uses dialog and grid semantics, roving focus, full-date day
labels, `aria-selected`, and `aria-current="date"`. Decorative icons are hidden and icon-only
buttons have accessible names. Month, year, and day cell sizing follows the density calendar tokens
inside stable four-row selection grids. Previous/next glyphs mirror in RTL.

## Showcase

Add the picker-family showcase at `/date-time-pickers` with a basic Signal Forms date field, format
override, date constraints, and RTL example. Each live behavior has a matching standalone snippet
using `ShowcaseCode` from `src/app/shared/showcase-code` and public imports from `./shared/ui-lib`.

## Angular Rules

- Use standalone Angular APIs without `standalone: true` or explicit OnPush metadata.
- Use signals, `FormValueControl`, native template control flow, host metadata, and strict types.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The component and public types are exported from the feature and root barrels.
- Display/manual entry defaults to `DD-MM-YYYY`; the model remains `YYYY-MM-DD | null`.
- Invalid manual input displays its specific parse, range, or unavailable-date message through the
  surrounding `ms-signal-form-field` after the field is touched or dirty.
- Calendar and manual selection honor constraints and synchronize the Signal Forms model.
- Keyboard, focus, screen-reader, disabled, readonly, and RTL behavior match this specification.
- Styling is token-based, dense, responsive, and forwarded from the style index.
- Matching showcase examples compile and the Angular build succeeds.
