import { Component, signal } from '@angular/core';
import { FormField, form, required, schema } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import {
  AutocompleteComponent,
  AutocompleteOptionComponent,
  AutocompleteOption,
  AutocompleteSearchSource,
} from '../../shared/ui-lib/components/autocomplete';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../shared/ui-lib/components/signal-form-field';

interface City {
  readonly id: string;
  readonly name: string;
  readonly country: string;
}

@Component({
  selector: 'app-autocomplete',
  imports: [
    RouterLink,
    AutocompleteComponent,
    AutocompleteOptionComponent,
    FormField,
    SignalFormField,
    ShowcaseCode,
  ],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.scss',
})
export class Autocomplete {
  private readonly signalFormModel = signal<AutocompleteForm>({
    country: null,
  });

  protected readonly role = signal<string | null>('developer');
  protected readonly selectedCities = signal<string[]>(['doha']);
  protected readonly signalForm = form(
    this.signalFormModel,
    schema<AutocompleteForm>((path) => {
      required(path.country, { message: 'Choose a country.' });
    }),
  );
  protected readonly countryField = this.signalForm.country;

  protected readonly roleOptions: readonly AutocompleteOption<string>[] = [
    { label: 'Designer', value: 'designer', description: 'Shapes visual and interaction systems' },
    { label: 'Developer', value: 'developer', description: 'Builds product interfaces' },
    { label: 'Product manager', value: 'pm', description: 'Coordinates product direction' },
    { label: 'Support lead', value: 'support', disabled: true },
  ];

  protected readonly cityOptions: readonly AutocompleteOption<string>[] = [
    { label: 'Doha', value: 'doha', group: 'Middle East' },
    { label: 'Dubai', value: 'dubai', group: 'Middle East' },
    { label: 'Riyadh', value: 'riyadh', group: 'Middle East' },
    { label: 'London', value: 'london', group: 'Europe' },
    { label: 'Madrid', value: 'madrid', group: 'Europe' },
  ];

  protected readonly countryOptions: readonly AutocompleteOption<string>[] = [
    { label: 'Qatar', value: 'QA' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'Saudi Arabia', value: 'SA' },
  ];

  private readonly remoteCities: readonly AutocompleteOption<City>[] = [
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

  protected readonly asyncCitySource: AutocompleteSearchSource<City> = (query) =>
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

  protected readonly staticSnippet = `import { Component, signal } from '@angular/core';

import { AutocompleteComponent, AutocompleteOptionComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-autocomplete-static-example',
  imports: [AutocompleteComponent, AutocompleteOptionComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="role">Role</label>
      <ms-autocomplete
        id="role"
        name="role"
        placeholder="Choose a role"
        [(value)]="role"
      >
        <ms-autocomplete-option value="designer" label="Designer">
          <strong>Designer</strong>
          <span>Shapes visual and interaction systems</span>
        </ms-autocomplete-option>
        <ms-autocomplete-option value="developer">Developer</ms-autocomplete-option>
        <ms-autocomplete-option value="pm">Product manager</ms-autocomplete-option>
      </ms-autocomplete>
    </ms-signal-form-field>
  \`,
})
export class AutocompleteStaticExample {
  readonly role = signal<string | null>('developer');
}`;

  protected readonly multipleSnippet = `import { Component, signal } from '@angular/core';

import { AutocompleteComponent, AutocompleteOptionComponent, SignalFormField } from './shared/ui-lib';

@Component({
  selector: 'app-autocomplete-multiple-example',
  imports: [AutocompleteComponent, AutocompleteOptionComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="cities">Cities</label>
      <ms-autocomplete
        id="cities"
        name="cities"
        placeholder="Choose cities"
        [multiple]="true"
        [(value)]="selectedCities"
      >
        <ms-autocomplete-option value="doha" group="Middle East">Doha</ms-autocomplete-option>
        <ms-autocomplete-option value="dubai" group="Middle East">Dubai</ms-autocomplete-option>
        <ms-autocomplete-option value="london" group="Europe">London</ms-autocomplete-option>
      </ms-autocomplete>
    </ms-signal-form-field>
  \`,
})
export class AutocompleteMultipleExample {
  readonly selectedCities = signal<string[]>(['doha']);
}`;

  protected readonly asyncSnippet = `import { Component } from '@angular/core';

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
  selector: 'app-autocomplete-async-example',
  imports: [AutocompleteComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="remote-city">Remote city</label>
      <ms-autocomplete
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
export class AutocompleteAsyncExample {
  readonly cities: readonly AutocompleteOption<City>[] = [
    { label: 'Doha', value: { id: 'doha', name: 'Doha', country: 'Qatar' } },
    { label: 'Dubai', value: { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates' } },
  ];

  readonly citySource: AutocompleteSearchSource<City> = (query) =>
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

import {
  AutocompleteComponent,
  AutocompleteOptionComponent,
  SignalFormField,
} from './shared/ui-lib';

type CountryForm = {
  country: string | null;
};

@Component({
  selector: 'app-autocomplete-form-example',
  imports: [AutocompleteComponent, AutocompleteOptionComponent, FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="country">Country</label>
      <ms-autocomplete
        id="country"
        placeholder="Choose a country"
        [formField]="countryField"
      >
        <ms-autocomplete-option value="QA">Qatar</ms-autocomplete-option>
        <ms-autocomplete-option value="AE">United Arab Emirates</ms-autocomplete-option>
        <ms-autocomplete-option value="SA">Saudi Arabia</ms-autocomplete-option>
      </ms-autocomplete>
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="readonly-role">Readonly value</label>
      <ms-autocomplete
        id="readonly-role"
        placeholder="Readonly"
        readonly
        [value]="'developer'"
      >
        <ms-autocomplete-option value="designer">Designer</ms-autocomplete-option>
        <ms-autocomplete-option value="developer">Developer</ms-autocomplete-option>
        <ms-autocomplete-option value="pm">Product manager</ms-autocomplete-option>
      </ms-autocomplete>
    </ms-signal-form-field>

    <ms-signal-form-field dir="rtl">
      <label for="rtl-city">RTL autocomplete</label>
      <ms-autocomplete id="rtl-city" placeholder="اختر مدينة">
        <ms-autocomplete-option value="doha" group="Middle East">Doha</ms-autocomplete-option>
        <ms-autocomplete-option value="dubai" group="Middle East">Dubai</ms-autocomplete-option>
        <ms-autocomplete-option value="london" group="Europe">London</ms-autocomplete-option>
      </ms-autocomplete>
    </ms-signal-form-field>
  \`,
})
export class AutocompleteFormExample {
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
}`;
}

type AutocompleteForm = {
  country: string | null;
};
