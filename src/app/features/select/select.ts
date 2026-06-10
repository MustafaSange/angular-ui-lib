import { Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import { RouterLink } from '@angular/router';

import {
  SelectComponent,
  SelectOption,
  SelectOptionComponent,
  SelectSearchSource,
} from '../../shared/ui-lib/components/select';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../shared/ui-lib/components/signal-form-field';

interface City {
  readonly id: string;
  readonly name: string;
  readonly country: string;
}

type SelectForm = {
  country: string | null;
};

@Component({
  selector: 'app-select',
  imports: [
    RouterLink,
    FormField,
    SelectComponent,
    SelectOptionComponent,
    SignalFormField,
    ShowcaseCode,
  ],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  private readonly signalFormModel = signal<SelectForm>({
    country: null,
  });

  protected readonly role = signal<string | null>('developer');
  protected readonly status = signal<string | null>('active');
  protected readonly selectedCities = signal<string[]>(['doha']);
  protected readonly disabledValue = signal<string | null>('developer');
  protected readonly signalForm = form(
    this.signalFormModel,
    schema<SelectForm>((path) => {
      required(path.country, { message: 'Choose a country.' });
    }),
  );
  protected readonly countryField = this.signalForm.country;

  protected readonly roleOptions: readonly SelectOption<string>[] = [
    { label: 'Designer', value: 'designer', description: 'Shapes visual and interaction systems' },
    { label: 'Developer', value: 'developer', description: 'Builds product interfaces' },
    { label: 'Product manager', value: 'pm', description: 'Coordinates product direction' },
    { label: 'Support lead', value: 'support', disabled: true },
  ];

  protected readonly statusOptions: readonly SelectOption<string>[] = [
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Archived', value: 'archived' },
  ];

  protected readonly cityOptions: readonly SelectOption<string>[] = [
    { label: 'Doha', value: 'doha', group: 'Middle East' },
    { label: 'Dubai', value: 'dubai', group: 'Middle East' },
    { label: 'Riyadh', value: 'riyadh', group: 'Middle East' },
    { label: 'London', value: 'london', group: 'Europe' },
    { label: 'Madrid', value: 'madrid', group: 'Europe' },
  ];

  protected readonly countryOptions: readonly SelectOption<string>[] = [
    { label: 'Qatar', value: 'QA' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'Saudi Arabia', value: 'SA' },
  ];

  private readonly remoteCities: readonly SelectOption<City>[] = [
    {
      label: 'Doha',
      value: { id: 'doha', name: 'Doha', country: 'Qatar' },
      description: 'Qatar',
    },
    {
      label: 'Dubai',
      value: { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates' },
      description: 'United Arab Emirates',
    },
    {
      label: 'Riyadh',
      value: { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia' },
      description: 'Saudi Arabia',
    },
    {
      label: 'Singapore',
      value: { id: 'singapore', name: 'Singapore', country: 'Singapore' },
      description: 'Singapore',
    },
  ];

  protected readonly asyncCitySource: SelectSearchSource<City> = (query) =>
    new Promise((resolve) => {
      window.setTimeout(() => {
        const normalizedQuery = query.toLocaleLowerCase();
        resolve(
          this.remoteCities.filter((city) =>
            [city.label, city.description]
              .filter((value): value is string => Boolean(value))
              .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
          ),
        );
      }, 700);
    });

  protected readonly compareCities = (a: City, b: City) => a.id === b.id;
  protected readonly displayCity = (city: City) => `${city.name}, ${city.country}`;
  protected readonly serializeCity = (city: City) => city.id;

  protected readonly basicSnippet = `import { Component, signal } from '@angular/core';

import { SelectComponent, SelectOptionComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-searchable-select-example',
  imports: [SelectComponent, SelectOptionComponent, SignalFormField],
  template: \`
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
  \`,
})
export class SearchableSelectExample {
  readonly role = signal<string | null>('developer');
}`;

  protected readonly nativeLikeSnippet = `import { Component, signal } from '@angular/core';

import { SelectComponent, SelectOptionComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-closed-select-example',
  imports: [SelectComponent, SelectOptionComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="status">Status</label>
      <ms-select
        id="status"
        name="status"
        placeholder="Choose status"
        [searchable]="false"
        [(value)]="status"
      >
        <ms-select-option value="active">Active</ms-select-option>
        <ms-select-option value="paused">Paused</ms-select-option>
        <ms-select-option value="archived">Archived</ms-select-option>
      </ms-select>
    </ms-signal-form-field>
  \`,
})
export class ClosedSelectExample {
  readonly status = signal<string | null>('active');
}`;

  protected readonly multipleSnippet = `import { Component, signal } from '@angular/core';

import { SelectComponent, SelectOptionComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-multiple-select-example',
  imports: [SelectComponent, SelectOptionComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="cities">Cities</label>
      <ms-select id="cities" name="cities" placeholder="Choose cities" multiple [(value)]="cities">
        <ms-select-option value="doha" group="Middle East">Doha</ms-select-option>
        <ms-select-option value="dubai" group="Middle East">Dubai</ms-select-option>
        <ms-select-option value="london" group="Europe">London</ms-select-option>
      </ms-select>
    </ms-signal-form-field>
  \`,
})
export class MultipleSelectExample {
  readonly cities = signal<string[]>(['doha']);
}`;

  protected readonly asyncSnippet = `import { Component } from '@angular/core';

import { SelectComponent, SelectOption, SelectSearchSource, SignalFormField } from './shared/ui-lib';

interface City {
  readonly id: string;
  readonly name: string;
  readonly country: string;
}

@Component({
  selector: 'app-async-select-example',
  imports: [SelectComponent, SignalFormField],
  template: \`
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
  \`,
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
        resolve(this.cities.filter((city) => city.label.toLocaleLowerCase().includes(normalizedQuery)));
      }, 700);
    });

  readonly compareCities = (a: City, b: City) => a.id === b.id;
  readonly displayCity = (city: City) => city.name;
  readonly serializeCity = (city: City) => city.id;
}`;

  protected readonly formsSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';

import { SelectComponent, SelectOptionComponent, SignalFormField } from './shared/ui-lib';

type CountryForm = {
  country: string | null;
};

@Component({
  selector: 'app-select-form-example',
  imports: [SelectComponent, SelectOptionComponent, FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="country">Country</label>
      <ms-select id="country" placeholder="Choose a country" [formField]="countryField">
        <ms-select-option value="QA">Qatar</ms-select-option>
        <ms-select-option value="AE">United Arab Emirates</ms-select-option>
        <ms-select-option value="SA">Saudi Arabia</ms-select-option>
      </ms-select>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="readonly-role">Readonly value</label>
      <ms-select id="readonly-role" placeholder="Readonly" readonly [value]="'developer'">
        <ms-select-option value="designer">Designer</ms-select-option>
        <ms-select-option value="developer">Developer</ms-select-option>
        <ms-select-option value="pm">Product manager</ms-select-option>
      </ms-select>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="disabled-role">Disabled value</label>
      <ms-select
        id="disabled-role"
        placeholder="Disabled"
        disabled
        [(value)]="disabledValue"
      >
        <ms-select-option value="designer">Designer</ms-select-option>
        <ms-select-option value="developer">Developer</ms-select-option>
        <ms-select-option value="pm">Product manager</ms-select-option>
      </ms-select>
    </ms-signal-form-field>

    <ms-signal-form-field dir="rtl">
      <label for="rtl-city">RTL select</label>
      <ms-select id="rtl-city" placeholder="اختر مدينة">
        <ms-select-option value="doha" group="Middle East">Doha</ms-select-option>
        <ms-select-option value="dubai" group="Middle East">Dubai</ms-select-option>
        <ms-select-option value="london" group="Europe">London</ms-select-option>
      </ms-select>
    </ms-signal-form-field>
  \`,
})
export class SelectFormExample {
  private readonly model = signal<CountryForm>({
    country: null,
  });

  protected readonly disabledValue = signal<string | null>('developer');

  protected readonly form = form(
    this.model,
    schema<CountryForm>((path) => {
      required(path.country, { message: 'Choose a country.' });
    }),
  );

  protected readonly countryField = this.form.country;
}`;
}
