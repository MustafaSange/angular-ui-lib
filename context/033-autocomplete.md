# Feature 033: Autocomplete

## Goal

Create a reusable autocomplete/select component for searchable option picking.

The component must support separate display labels and stored values, single and multiple
selection, form integration, async search, debounce, loading feedback, keyboard interaction, and
native-select behavior where practical for a custom Angular combobox.

## Public API

Import public pieces from the folder barrel:

```ts
import {
  AutocompleteComponent,
  AutocompleteOptionComponent,
  AutocompleteOption,
  AutocompleteSearchSource,
} from '../../shared/ui-lib';
```

Public pieces:

- `AutocompleteComponent<TValue>` with selector `ms-autocomplete`
- `AutocompleteOptionComponent<TValue>` with selector `ms-autocomplete-option`
- `AutocompleteOption<TValue>` for display and stored option data
- `AutocompleteSearchSource<TValue>` for sync or async option loading
- `AutocompleteCompareWith<TValue>`, `AutocompleteDisplayWith<TValue>`, and
  `AutocompleteValueSerializer<TValue>` helper types
- `AutocompleteComponent` implements Angular signal forms `FormValueControl`; it does not provide
  a `ControlValueAccessor`

Required option type:

```ts
interface AutocompleteOption<TValue> {
  readonly label: string;
  readonly value: TValue;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly icon?: string;
  readonly group?: string;
}
```

Required component APIs:

- `options`: static `AutocompleteOption<TValue>[]`, default `[]`
- `source`: static options or `(query) => options | Promise<options> | Observable<options>`,
  default `null`
- `value`: model storing `TValue | null` in single mode and `TValue[]` in multiple mode
- `multiple`: enables multiple selection, default `false`
- `placeholder`, `disabled`, `readonly`, `required`, `clearable`, `name`, and `id`
- `debounceMs`: async search debounce, default `250`
- `minQueryLength`: minimum query length before loading source options, default `0`
- `compareWith`: value comparison, default `Object.is`
- `displayWith`: selected-value display fallback, default `String(value)`
- `valueSerializer`: hidden native form value serialization, default `String(value)`

Required option component APIs:

- `value`: required stored value for the option
- `label`: optional display/search label override; projected text is used when omitted
- `disabled`, `description`, `icon`, and `group`
- projected option content renders inside the dropdown; use `label` when projected markup needs a
  plain-text search, selected-value, or accessible label

The component integrates with Angular signal forms through `[formField]`, a `value` model input,
and a `touch` output. Reactive forms compatibility through `ControlValueAccessor` is intentionally
out of scope unless a later compatibility requirement is added.

## Desired Usage

Single selection with separate display and stored values:

```ts
import { Component, signal } from '@angular/core';

import {
  AutocompleteComponent,
  AutocompleteOptionComponent,
  SignalFormField,
} from './shared/ui-lib';

@Component({
  selector: 'app-role-picker-example',
  imports: [AutocompleteComponent, AutocompleteOptionComponent, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="role">Role</label>
      <ms-autocomplete id="role" name="role" placeholder="Choose a role" [(value)]="role">
        <ms-autocomplete-option value="designer" label="Designer">
          <strong>Designer</strong>
          <span>Shapes visual and interaction systems</span>
        </ms-autocomplete-option>
        <ms-autocomplete-option value="developer">Developer</ms-autocomplete-option>
        <ms-autocomplete-option value="pm">Product manager</ms-autocomplete-option>
      </ms-autocomplete>
    </ms-signal-form-field>
  `,
})
export class RolePickerExample {
  readonly role = signal<string | null>('developer');
}
```

Async search with object values:

```ts
import { Component } from '@angular/core';

import {
  AutocompleteComponent,
  AutocompleteOption,
  AutocompleteSearchSource,
  SignalFormField,
} from './shared/ui-lib';

interface City {
  readonly id: string;
  readonly name: string;
  readonly country: string;
}

@Component({
  selector: 'app-city-picker-example',
  imports: [AutocompleteComponent, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="city">City</label>
      <ms-autocomplete
        id="city"
        name="city"
        placeholder="Search cities"
        [source]="citySource"
        [debounceMs]="300"
        [minQueryLength]="1"
        [compareWith]="compareCities"
        [displayWith]="displayCity"
        [valueSerializer]="serializeCity"
      />
    </ms-signal-form-field>
  `,
})
export class CityPickerExample {
  readonly cities: readonly AutocompleteOption<City>[] = [
    { label: 'Doha', value: { id: 'doha', name: 'Doha', country: 'Qatar' } },
    { label: 'Dubai', value: { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates' } },
  ];

  readonly citySource: AutocompleteSearchSource<City> = (query) =>
    new Promise((resolve) => {
      window.setTimeout(() => {
        const normalizedQuery = query.toLocaleLowerCase();
        resolve(
          this.cities.filter((city) => city.label.toLocaleLowerCase().includes(normalizedQuery)),
        );
      }, 700);
    });

  readonly compareCities = (a: City, b: City) => a.id === b.id;
  readonly displayCity = (city: City) => city.name;
  readonly serializeCity = (city: City) => city.id;
}
```

Signal form binding:

```ts
import { Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import {
  AutocompleteComponent,
  AutocompleteOptionComponent,
  SignalFormField,
} from './shared/ui-lib';

type CountryForm = {
  country: string | null;
};

@Component({
  selector: 'app-country-picker-example',
  imports: [AutocompleteComponent, AutocompleteOptionComponent, FormField, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="country">Country</label>
      <ms-autocomplete id="country" placeholder="Choose a country" [formField]="countryField">
        <ms-autocomplete-option value="QA">Qatar</ms-autocomplete-option>
        <ms-autocomplete-option value="AE">United Arab Emirates</ms-autocomplete-option>
        <ms-autocomplete-option value="SA">Saudi Arabia</ms-autocomplete-option>
      </ms-autocomplete>
    </ms-signal-form-field>
  `,
})
export class CountryPickerExample {
  private readonly model = signal<CountryForm>({
    country: null,
  });

  protected readonly form = form(
    this.model,
    schema<CountryForm>((path) => {
      required(path.country, { message: 'Choose a country.' });
    }),
  );

  protected readonly countryField = this.form.country;
}
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/autocomplete`

The feature includes:

- `AutocompleteComponent`
- `AutocompleteOptionComponent`
- public option, source, compare, display, and serialization types
- `index.ts`

The component renders an input with `role="combobox"`, a native popover panel with
`role="listbox"`, option rows with `role="option"`, optional multiple-selection chips, optional
clear and toggle buttons, a hidden projected option source, and hidden inputs when `name` is
provided.

## Behavior

- Filter static options by label, description, or group.
- Read static options from projected `ms-autocomplete-option` children and from the optional
  `options` input; projected options are preferred for hand-authored/static markup.
- Load `source` results after `debounceMs`; support sync arrays, Promises, and Observables.
- Cancel stale Observable subscriptions and ignore stale Promise results.
- Show a progress indicator while loading and a status row for empty or failed loads.
- Store and emit option `value`; never use option `label` as the stored value unless the consumer
  explicitly chooses that value.
- In single mode, selecting an option stores `TValue` and closes the panel.
- In multiple mode, selecting an option toggles it in a `TValue[]`, keeps the panel open, and
  renders selected chips.
- `disabled` options cannot be selected by pointer or keyboard.
- `clearable` shows a clear button only when there is a selection and the control is interactive.
- `required` participates in Angular validation.
- `[formField]` syncs signal form value, disabled, readonly, required, name, and touched state
  through the `FormValueControl` contract.
- `name` renders hidden input values using `valueSerializer` for native form submission.
- `readonly` prevents edits and panel opening while preserving the current value.

## Accessibility

- Use `role="combobox"` on the input, `aria-expanded`, `aria-controls`,
  `aria-activedescendant`, and `aria-autocomplete="list"`.
- Use `role="listbox"` on the panel and `role="option"` with `aria-selected` on options.
- Use `aria-multiselectable` in multiple mode.
- Keyboard support:
  - `ArrowDown` and `ArrowUp` open the panel and move active option
  - `Home` and `End` move to the first and last enabled option when open
  - `Enter` selects the active option
  - `Escape` closes the panel and restores selected display text
  - `Tab` closes the panel and marks the control touched
- Keep focus visible through the existing form-field focus styling.
- Decorative icons use `aria-hidden="true"` and icon-only buttons have text labels.

## Styling

Feature styles live in:

`src/styles/components/_autocomplete.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, border, shadow, motion, and focus behavior
- match the enterprise-dense form-field sizing when projected in `ms-signal-form-field`: the
  visible control fits the shared `--control-height-sm` 28px total height, including wrapper
  borders, and uses `--font-size-sm` control text
- use concise internal hooks such as `.autocomplete-panel`, `.autocomplete-option`,
  `.autocomplete-chip`, and `.autocomplete-progress`
- use logical sizing and placement so the control and panel behave in both `dir="ltr"` and
  `dir="rtl"`
- integrate with `ms-signal-form-field` without adding app-specific form-field rules

## Showcase

Update the form-fields showcase with copyable examples for:

- static single select
- separate display labels and stored values
- multiple select
- async debounced search with progress
- disabled or readonly state
- required signal form usage
- RTL layout

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection.
- Prefer signals and `inject()`.
- Use native template control flow.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The public API is exported from the autocomplete folder barrel and shared component barrel.
- `ms-autocomplete` stores values separately from displayed labels.
- Single and multiple selection work.
- Async search debounces, shows progress, and ignores stale results.
- Angular forms can read, write, disable, touch, and validate the control.
- Hidden form values are rendered when `name` is provided.
- Keyboard and pointer interactions follow the documented behavior.
- Styling uses existing tokens, compact form-field sizing, logical properties, and RTL-safe panel
  placement.
- The showcase demonstrates core variants and renders matching copyable snippets.
