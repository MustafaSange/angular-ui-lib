import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ButtonToggleDirective,
  ButtonToggleGroup,
  type ButtonToggleValue,
} from '../../shared/ui-lib/components/button-toggle';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import { SignalFormField, SignalFormHint } from '../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-button-toggle',
  imports: [
    RouterLink,
    ButtonToggleGroup,
    ButtonToggleDirective,
    ShowcaseCode,
    SignalFormField,
    SignalFormHint,
  ],
  templateUrl: './button-toggle.html',
  styleUrl: './button-toggle.scss',
})
export class ButtonToggle {
  protected readonly view = signal<ButtonToggleValue>('list');
  protected readonly density = signal<ButtonToggleValue>('comfortable');
  protected readonly status = signal<ButtonToggleValue>('open');
  protected readonly formView = signal<ButtonToggleValue>('grid');
  protected readonly rtlValue = signal<ButtonToggleValue>('middle');

  protected readonly basicSnippet = `import { Component, signal } from '@angular/core';

import { ButtonToggleDirective, ButtonToggleGroup, type ButtonToggleValue, } from './shared/ui-lib';

@Component({
  selector: 'app-basic-button-toggle-example', imports: [ButtonToggleGroup, ButtonToggleDirective], template: \`
    <ms-button-toggle-group [(value)]="view" aria-label="View mode">
      <button type="button" msButtonToggleValue="list">List</button>
      <button type="button" msButtonToggleValue="grid">Grid</button>
      <button type="button" msButtonToggleValue="table">Table</button>
    </ms-button-toggle-group>
  \`, })
export class BasicButtonToggleExample {
  protected readonly view = signal<ButtonToggleValue>('list');
}`;

  protected readonly iconSnippet = `import { Component, signal } from '@angular/core';

import { ButtonToggleDirective, ButtonToggleGroup, type ButtonToggleValue, } from './shared/ui-lib';

@Component({
  selector: 'app-icon-button-toggle-example', imports: [ButtonToggleGroup, ButtonToggleDirective], template: \`
    <ms-button-toggle-group [(value)]="density" aria-label="Dashboard density">
      <button type="button" msButtonToggleValue="compact">
        <span class="ms-icon" aria-hidden="true">dashboard</span>
        Compact
      </button>
      <button type="button" msButtonToggleValue="comfortable">
        <span class="ms-icon" aria-hidden="true">filter_list</span>
        Comfortable
      </button>
      <button type="button" msButtonToggleValue="spacious">
        <span class="ms-icon" aria-hidden="true">settings</span>
        Spacious
      </button>
    </ms-button-toggle-group>
  \`, })
export class IconButtonToggleExample {
  protected readonly density = signal<ButtonToggleValue>('comfortable');
}`;

  protected readonly disabledSnippet = `import { Component, signal } from '@angular/core';

import { ButtonToggleDirective, ButtonToggleGroup, type ButtonToggleValue, } from './shared/ui-lib';

@Component({
  selector: 'app-disabled-button-toggle-example', imports: [ButtonToggleGroup, ButtonToggleDirective], template: \`
    <ms-button-toggle-group [(value)]="status" aria-label="Issue status">
      <button type="button" msButtonToggleValue="open">Open</button>
      <button type="button" msButtonToggleValue="pending" disabled>Pending</button>
      <button type="button" msButtonToggleValue="closed">Closed</button>
    </ms-button-toggle-group>

    <ms-button-toggle-group value="monthly" disabled aria-label="Billing cycle">
      <button type="button" msButtonToggleValue="monthly">Monthly</button>
      <button type="button" msButtonToggleValue="annual">Annual</button>
    </ms-button-toggle-group>
  \`, })
export class DisabledButtonToggleExample {
  protected readonly status = signal<ButtonToggleValue>('open');
}`;

  protected readonly signalFormFieldSnippet = `import { Component, signal } from '@angular/core';

import { ButtonToggleDirective, ButtonToggleGroup, type ButtonToggleValue, } from './shared/ui-lib';
import {
  SignalFormField, SignalFormHint, } from '../../shared/ui-lib/components/signal-form-field';

@Component({
  selector: 'app-form-field-button-toggle-example', imports: [ButtonToggleGroup, ButtonToggleDirective, SignalFormField, SignalFormHint], template: \`
    <ms-signal-form-field>
      <label id="view-mode-label">View mode</label>

      <ms-button-toggle-group [(value)]="view" aria-labelledby="view-mode-label">
        <button type="button" msButtonToggleValue="list">List</button>
        <button type="button" msButtonToggleValue="grid">Grid</button>
      </ms-button-toggle-group>

      <ms-hint>Choose how results are displayed.</ms-hint>
    </ms-signal-form-field>
  \`, })
export class FormFieldButtonToggleExample {
  protected readonly view = signal<ButtonToggleValue>('grid');
}`;

  protected readonly rtlSnippet = `import { Component, signal } from '@angular/core';

import {
  ButtonToggleDirective,
  ButtonToggleGroup,
  type ButtonToggleValue,
} from './shared/ui-lib';

@Component({
  selector: 'app-rtl-button-toggle-example',
  imports: [ButtonToggleGroup, ButtonToggleDirective],
  template: \`
    <div dir="rtl">
      <ms-button-toggle-group [(value)]="position" aria-label="RTL position">
        <button type="button" msButtonToggleValue="start">Start</button>
        <button type="button" msButtonToggleValue="middle">Middle</button>
        <button type="button" msButtonToggleValue="end">End</button>
      </ms-button-toggle-group>
    </div>
  \`,
})
export class RtlButtonToggleExample {
  protected readonly position = signal<ButtonToggleValue>('middle');
}`;
}
