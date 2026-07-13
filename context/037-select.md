# Feature 037: Select

## Goal

Create a reusable select control for single-value, multiple-value, searchable, and async option
selection. It supports projected `ms-select-option` items, direct option arrays, remote search
sources, Angular signal form binding, and plain form submission through hidden inputs.

Shared reusable components use the `ms-` selector prefix:

- `<ms-select>`
- `<ms-select-option>`

## Public API

Import select primitives from the folder barrel or the top-level UI library barrel:

```ts
import {
  SelectComponent,
  SelectOption,
  SelectOptionComponent,
  SelectSearchSource,
  SelectSelectedOptionContext,
} from '../../shared/ui-lib';
```

Public exports:

- `SelectComponent<TValue>` for the select control
- `SelectOptionComponent<TValue>` for projected options
- `SelectOption<TValue>` for option data
- `SelectSearchSource<TValue>` for local or remote option sources
- `SelectAsyncResult<TValue>` for sync, promise, or observable source results
- `SelectCompareWith<TValue>` for custom value comparison
- `SelectDisplayWith<TValue>` for rendering selected values not present in loaded options
- `SelectSelectedOptionContext<TValue>` for custom multiple-selection chip template context
- `SelectValueSerializer<TValue>` for serializing hidden form input values

`SelectComponent<TValue>` inputs and model:

```ts
class SelectComponent<TValue> {
  readonly options: InputSignal<readonly SelectOption<TValue>[]>;
  readonly source: InputSignal<SelectSearchSource<TValue> | null>;
  readonly value: ModelSignal<TValue | TValue[] | null>;
  readonly multiple: InputSignalWithTransform<boolean, unknown>;
  readonly searchable: InputSignalWithTransform<boolean, unknown>;
  readonly placeholder: InputSignal<string>;
  readonly disabled: InputSignalWithTransform<boolean, unknown>;
  readonly readonly: InputSignalWithTransform<boolean, unknown>;
  readonly required: InputSignalWithTransform<boolean, unknown>;
  readonly clearable: InputSignalWithTransform<boolean, unknown>;
  readonly debounceMs: InputSignal<number>;
  readonly minQueryLength: InputSignal<number>;
  readonly name: InputSignal<string>;
  readonly compareWith: InputSignal<SelectCompareWith<TValue>>;
  readonly displayWith: InputSignal<SelectDisplayWith<TValue>>;
  readonly selectedOptionTemplate: InputSignal<TemplateRef<
    SelectSelectedOptionContext<TValue>
  > | null>;
  readonly valueSerializer: InputSignal<SelectValueSerializer<TValue>>;
  readonly id: InputSignal<string | null>;
  readonly ariaLabel: InputSignal<string>;
  readonly touch: OutputEmitterRef<void>;

  focus(options?: FocusOptions): void;
  reset(): void;
}
```

Defaults:

- `options` is `[]`
- `source` is `null`
- `value` is `null`
- `multiple` is `false`
- `searchable` is `true`
- `placeholder` is `''`
- `disabled` is `false`
- `readonly` is `false`
- `required` is `false`
- `clearable` is `true`
- `debounceMs` is `250`
- `minQueryLength` is `0`
- `name` is `''`
- `compareWith` uses `Object.is`
- `displayWith` stringifies the selected value
- `selectedOptionTemplate` is `null` and renders the standard selected-option label
- `valueSerializer` stringifies the selected value
- `id` is `null` and falls back to a generated input id
- `ariaLabel` is `''`; the `aria-label` input alias forwards a non-empty value to the internal
  combobox input

`SelectOptionComponent<TValue>` inputs:

```ts
class SelectOptionComponent<TValue> {
  readonly value: InputSignal<TValue>;
  readonly label: InputSignal<string | null>;
  readonly disabled: InputSignalWithTransform<boolean, unknown>;
  readonly description: InputSignal<string | null>;
  readonly icon: InputSignal<string | null>;
  readonly group: InputSignal<string | null>;
}
```

Projected options infer their label from projected text when `label` is omitted.

Option data:

```ts
interface SelectOption<TValue> {
  readonly label: string;
  readonly value: TValue;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly icon?: string;
  readonly group?: string;
  readonly template?: TemplateRef<void>;
}

interface SelectSelectedOptionContext<TValue> {
  readonly $implicit: SelectOption<TValue>;
  readonly index: number;
}
```

Source types:

```ts
type SelectAsyncResult<TValue> =
  | readonly SelectOption<TValue>[]
  | Promise<readonly SelectOption<TValue>[]>
  | Observable<readonly SelectOption<TValue>[]>;

type SelectSearchSource<TValue> =
  | readonly SelectOption<TValue>[]
  | ((query: string) => SelectAsyncResult<TValue>);
```

## Usage

Basic searchable select:

```ts
import { Component, signal } from '@angular/core';

import { SelectComponent, SelectOptionComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-searchable-select-example',
  imports: [SelectComponent, SelectOptionComponent, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="role">Role</label>
      <ms-select id="role" name="role" placeholder="Choose a role" [(value)]="role">
        <ms-select-option value="designer" label="Designer">
          <strong>Designer</strong>
          <span>Shapes visual and interaction systems</span>
        </ms-select-option>
        <ms-select-option value="developer">Developer</ms-select-option>
        <ms-select-option value="pm">Product manager</ms-select-option>
      </ms-select>
    </ms-signal-form-field>
  `,
})
export class SearchableSelectExample {
  readonly role = signal<string | null>('developer');
}
```

Multiple select:

```ts
import { Component, signal } from '@angular/core';

import { SelectComponent, SelectOptionComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-multiple-select-example',
  imports: [SelectComponent, SelectOptionComponent, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="cities">Cities</label>
      <ms-select id="cities" name="cities" placeholder="Choose cities" multiple [(value)]="cities">
        <ms-select-option value="doha" group="Middle East">Doha</ms-select-option>
        <ms-select-option value="dubai" group="Middle East">Dubai</ms-select-option>
        <ms-select-option value="london" group="Europe">London</ms-select-option>
      </ms-select>
    </ms-signal-form-field>
  `,
})
export class MultipleSelectExample {
  readonly cities = signal<string[]>(['doha']);
}
```

Async source:

```ts
import { Component } from '@angular/core';

import {
  SelectComponent,
  SelectOption,
  SelectSearchSource,
  SignalFormField,
} from './shared/ui-lib';

interface City {
  readonly id: string;
  readonly name: string;
  readonly country: string;
}

@Component({
  selector: 'app-async-select-example',
  imports: [SelectComponent, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="remote-city">Remote city</label>
      <ms-select
        id="remote-city"
        name="remoteCity"
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
export class AsyncSelectExample {
  readonly cities: readonly SelectOption<City>[] = [
    { label: 'Doha', value: { id: 'doha', name: 'Doha', country: 'Qatar' } },
    { label: 'Dubai', value: { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates' } },
  ];

  readonly citySource: SelectSearchSource<City> = (query) =>
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

import { SelectComponent, SelectOptionComponent, SignalFormField } from './shared/ui-lib';

type CountryForm = {
  country: string | null;
};

@Component({
  selector: 'app-select-form-example',
  imports: [SelectComponent, SelectOptionComponent, FormField, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="country">Country</label>
      <ms-select id="country" placeholder="Choose a country" [formField]="countryField">
        <ms-select-option value="QA">Qatar</ms-select-option>
        <ms-select-option value="AE">United Arab Emirates</ms-select-option>
        <ms-select-option value="SA">Saudi Arabia</ms-select-option>
      </ms-select>
    </ms-signal-form-field>
  `,
})
export class SelectFormExample {
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

## Component Behavior

Options can come from three places:

- projected `<ms-select-option>` children
- the `options` input
- the `source` input

When `source` is set, visible options come from the loaded source results. When `source` is absent,
visible options come from projected options plus `options`.

Search behavior:

- `searchable` is enabled by default
- static options are filtered by label, description, and group
- source arrays are filtered by label, description, and group
- source functions receive the debounced query string
- source functions can return an array, promise, or observable
- source lookup waits until `minQueryLength` is satisfied
- loading state is shown while a query is debouncing or source results are pending
- source errors render `Options could not be loaded`
- empty result sets render `No options found`
- stale source results are ignored when a newer request has started

Selection behavior:

- single-value mode commits one value and closes the panel
- multiple mode toggles values in an array and keeps the panel open
- multiple selected values render as removable chips
- `selectedOptionTemplate` can replace each selected chip's label content; its implicit value is the
  resolved `SelectOption`, and `index` is the selection-order index
- disabled options cannot be selected
- `clearable` shows a clear button when there is a value and the control is interactive
- `clearSelection()` writes `null` in single mode and `[]` in multiple mode
- incoming values are normalized to a single value in single mode and an array in multiple mode
- selected option labels are resolved from all static and loaded options, then fall back to
  `displayWith`

Form behavior:

- the component implements `FormValueControl<TValue | TValue[] | null>`
- the host marks itself with `formField`
- `touch` emits once when the control is blurred or tabbed away after interaction
- when `name` is provided, selected values are serialized into hidden inputs
- multiple mode renders one hidden input per serialized selected value

Panel and focus behavior:

- the panel uses the native `popover="auto"` API
- focusing the input schedules the panel to open
- blur closes the panel when focus leaves the control and panel
- `focus(options)` focuses the internal input and opens the panel when interactive
- `reset()` clears the query, clears interaction state, and closes the panel
- the panel closes when the control becomes disabled or readonly
- active options scroll into view while navigating the open panel

Keyboard behavior:

- `ArrowDown` opens the panel and moves to the next enabled option
- `ArrowUp` opens the panel and moves to the previous enabled option
- `Home` moves to the first enabled option while open
- `End` moves to the last enabled option while open
- `Enter` selects the active option while open
- `Escape` closes the panel and clears the query
- `Tab` closes the panel and marks the control touched
- `Backspace` removes the last selected value in non-searchable multiple mode

## Styling

Select styles live in:

`src/styles/components/_select.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use `.select-*` internal class hooks
- keep `<ms-select>` block-level and flexible inside form field layouts
- match the enterprise-dense form-field sizing when projected in `ms-signal-form-field`: the
  visible control fits the shared `--control-height-sm` 28px total height, including wrapper
  borders, and uses `--font-size-sm` control text
- use design tokens for control sizing, spacing, borders, radius, shadows, color, and motion
- use logical CSS properties for inline/block sizing, margins, borders, and placement
- use popover anchor placement with logical fallback positions
- keep projected source options hidden outside the rendered panel
- render multiple selected values as compact chips with removable actions
- keep selected chips visible when a non-searchable multiple select receives focus inside a clipped,
  enterprise-dense form field; the internal focus target overlays the selected content instead of
  horizontally scrolling it out of view
- show a token-based loading spinner while options are loading

## Accessibility

- the input uses `role="combobox"`
- a supplied `aria-label` is forwarded to the internal combobox input
- the panel uses `role="listbox"`
- options use `role="option"`
- multiple mode sets `aria-multiselectable`
- expanded state is reflected with `aria-expanded`
- active option state is reflected with `aria-activedescendant`
- search mode sets `aria-autocomplete="list"`
- required state is reflected with `required` and `aria-required`
- disabled options set `aria-disabled`
- selected options set `aria-selected`
- loading feedback uses `role="status"`
- chip remove buttons and clear/toggle buttons have accessible labels
- decorative Material Symbols are hidden from assistive technology
- disabled and readonly controls do not open or change value

## Showcase

The select showcase lives at `/select` and demonstrates:

- searchable select
- non-searchable select
- multiple select with grouped options
- async source loading with debouncing and custom display/comparison/serialization
- signal form binding
- readonly state
- disabled state
- RTL layout

Showcase snippets use `ShowcaseCode`, are hand-authored in the feature component `.ts` file, import
public APIs through `./shared/ui-lib`, and are rendered near their matching visual examples.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Prefer signals and `inject()`.
- Rely on Angular 22 default OnPush change detection.
- Use native Angular template control flow.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The public API is exported from the select folder barrel and top-level UI library barrel.
- `<ms-select>` supports projected options and option data arrays.
- Search filters static options by label, description, and group.
- Async sources support array, promise, and observable results.
- Debounced source loading, loading feedback, empty feedback, and error feedback are implemented.
- Single mode commits one value; multiple mode commits an array.
- Multiple mode supports custom selected-chip content through `selectedOptionTemplate` without
  replacing the built-in remove action.
- Disabled and readonly states prevent interaction.
- The control implements signal form binding through `FormValueControl`.
- Hidden form inputs are rendered when `name` is provided.
- Keyboard navigation works for opening, active option movement, selection, closing, and tabbing away.
- Styling uses existing tokens, compact form-field sizing, logical CSS properties, and RTL-safe
  placement.
- Accessibility roles, states, focus behavior, and labels are implemented.
- The showcase demonstrates core use cases and renders matching copyable snippets.
