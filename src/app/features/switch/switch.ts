import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ChoiceError,
  ChoiceHint,
  SwitchControl,
  SwitchGroup,
} from '../../shared/ui-lib/components/choice-controls';
import { ShowcaseCode } from '../../shared/showcase-code';
import { SwitchConfigurationExample } from './switch-configuration-example';

@Component({
  selector: 'app-switch',
  imports: [RouterLink, SwitchGroup, SwitchControl, ChoiceHint, ChoiceError, ShowcaseCode, SwitchConfigurationExample],
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
})
export class Switch {
  protected readonly variants = ([
    { value: 'classic', label: 'Classic' },
    { value: 'slim-track', label: 'Slim Track' },
  ] as const).map((variant) => ({
    ...variant,
    examples: [
      { label: 'Notifications', checked: signal(false), disabled: false },
      { label: 'Compact Mode', checked: signal(true), disabled: false },
      { label: 'Audit Logging', checked: signal(false), disabled: true },
      { label: 'Managed Backups', checked: signal(true), disabled: true },
    ],
  }));

  protected readonly comparisonSnippet = `import { Component, signal } from '@angular/core';
import { SwitchControl, SwitchGroup } from './shared/ui-lib';

@Component({
  selector: 'app-switch-comparison',
  imports: [SwitchControl, SwitchGroup],
  template: \`
    <div class="switch-comparison">
      @for (variant of variants; track variant.value) {
        <ms-switch-group>
          <legend>{{ variant.label }}</legend>
          @for (example of variant.examples; track example.label) {
            <ms-switch-control [variant]="variant.value" kind="success">
              <input
                type="checkbox"
                role="switch"
                #toggle
                [checked]="example.checked()"
                (change)="example.checked.set(toggle.checked)"
                [disabled]="example.disabled"
              />
              <label>
                {{ example.label }}
                <span aria-hidden="true"> · {{ example.checked() ? 'On' : 'Off' }}</span>
              </label>
            </ms-switch-control>
          }
        </ms-switch-group>
      }
    </div>
  \`,
  styles: \`
    .switch-comparison {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
      gap: var(--spacing-16);
    }
  \`,
})
export class SwitchComparison {
  protected readonly variants = ([
    { value: 'classic', label: 'Classic' },
    { value: 'slim-track', label: 'Slim Track' },
  ] as const).map((variant) => ({
    ...variant,
    examples: [
      { label: 'Notifications', checked: signal(false), disabled: false },
      { label: 'Compact Mode', checked: signal(true), disabled: false },
      { label: 'Audit Logging', checked: signal(false), disabled: true },
      { label: 'Managed Backups', checked: signal(true), disabled: true },
    ],
  }));
}`;

  protected readonly disabledSlimTrackSnippet = `import { Component } from '@angular/core';
import { SwitchControl, SwitchGroup } from './shared/ui-lib';

@Component({
  selector: 'app-disabled-slim-track-example',
  imports: [SwitchControl, SwitchGroup],
  template: \`
    <ms-switch-group>
      <legend>Disabled States</legend>
      <ms-switch-control variant="slim-track" kind="success">
        <input type="checkbox" role="switch" disabled />
        <label>Disabled Off</label>
      </ms-switch-control>
      <ms-switch-control variant="slim-track" kind="success">
        <input type="checkbox" role="switch" checked disabled />
        <label>Disabled On</label>
      </ms-switch-control>
    </ms-switch-group>
  \`,
})
export class DisabledSlimTrackExample {}`;

  protected readonly configurationSnippet = `import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideUiLib, SwitchControl, SwitchGroup } from './shared/ui-lib';

@Component({
  selector: 'app-root',
  imports: [SwitchControl, SwitchGroup],
  template: \`
    <ms-switch-group>
      <legend>Configured Switches</legend>
      <ms-switch-control>
        <input type="checkbox" role="switch" checked />
        <label>Success (Slim Track, Inherited)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic">
        <input type="checkbox" role="switch" checked />
        <label>Success (Classic)</label>
      </ms-switch-control>
      <ms-switch-control kind="warning">
        <input type="checkbox" role="switch" checked />
        <label>Warning (Slim Track)</label>
      </ms-switch-control>
      <ms-switch-control kind="danger">
        <input type="checkbox" role="switch" checked />
        <label>Danger (Slim Track)</label>
      </ms-switch-control>
      <ms-switch-control kind="info">
        <input type="checkbox" role="switch" checked />
        <label>Info (Slim Track)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic" kind="warning">
        <input type="checkbox" role="switch" checked />
        <label>Warning (Classic)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic" kind="danger">
        <input type="checkbox" role="switch" checked />
        <label>Danger (Classic)</label>
      </ms-switch-control>
      <ms-switch-control variant="classic" kind="info">
        <input type="checkbox" role="switch" checked />
        <label>Info (Classic)</label>
      </ms-switch-control>
    </ms-switch-group>
  \`,
})
export class App {}

// In an existing app, add switch defaults to provideUiLib in app.config.ts.
bootstrapApplication(App, {
  providers: [provideUiLib({
    switch: {
      variant: 'slim-track',
      kind: 'success',
    },
  })],
});`;

  protected readonly slimTrackSnippet = `import { Component } from '@angular/core';
import { ChoiceError, ChoiceHint, SwitchControl, SwitchGroup } from './shared/ui-lib';

@Component({
  selector: 'app-slim-track-switch-example',
  imports: [SwitchGroup, SwitchControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-switch-group>
      <legend>Slim Track Switches</legend>
      <ms-switch-control variant="slim-track">
        <input type="checkbox" role="switch" checked />
        <label>Notifications</label>
        <ms-choice-hint>Push critical alerts immediately.</ms-choice-hint>
      </ms-switch-control>
      <ms-switch-control variant="slim-track">
        <input type="checkbox" role="switch" />
        <label>Compact Mode</label>
        <ms-choice-hint>Reduce spacing in dense views.</ms-choice-hint>
      </ms-switch-control>
      <ms-switch-control variant="slim-track">
        <input type="checkbox" role="switch" disabled />
        <label>Audit Logging</label>
        <ms-choice-hint>Available on enterprise plans.</ms-choice-hint>
      </ms-switch-control>
      <ms-switch-control variant="slim-track">
        <input type="checkbox" role="switch" checked disabled />
        <label>Managed Backups</label>
        <ms-choice-hint>Enabled by your administrator.</ms-choice-hint>
      </ms-switch-control>
      <ms-switch-control variant="slim-track">
        <input type="checkbox" role="switch" />
        <label>Public Profile</label>
        <ms-choice-error>Review visibility settings before enabling.</ms-choice-error>
      </ms-switch-control>
      <ms-switch-control variant="slim-track" slot="label-before">
        <input type="checkbox" role="switch" />
        <label>Label Before</label>
        <ms-choice-hint>Places text before the switch.</ms-choice-hint>
      </ms-switch-control>
    </ms-switch-group>
  \`,
})
export class SlimTrackSwitchExample {}`;

  protected readonly classicSnippet = `import { Component } from '@angular/core';

import {
  ChoiceError,
  ChoiceHint,
  SwitchControl,
  SwitchGroup,
} from './shared/ui-lib';

@Component({
  selector: 'app-classic-switch-example',
  imports: [SwitchGroup, SwitchControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-switch-group>
      <legend>Classic Switches</legend>

      <ms-switch-control variant="classic">
        <input type="checkbox" role="switch" checked />
        <label>Notifications</label>
        <ms-choice-hint>Push critical alerts immediately.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control variant="classic">
        <input type="checkbox" role="switch" />
        <label>Compact Mode</label>
        <ms-choice-hint>Reduce spacing in dense views.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control variant="classic">
        <input type="checkbox" role="switch" disabled />
        <label>Audit Logging</label>
        <ms-choice-hint>Available on enterprise plans.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control variant="classic">
        <input type="checkbox" role="switch" checked disabled />
        <label>Managed Backups</label>
        <ms-choice-hint>Enabled by your administrator.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control variant="classic">
        <input type="checkbox" role="switch" />
        <label>Public Profile</label>
        <ms-choice-error>Review visibility settings before enabling.</ms-choice-error>
      </ms-switch-control>

      <ms-switch-control variant="classic" slot="label-before">
        <input type="checkbox" role="switch" />
        <label>Label Before</label>
        <ms-choice-hint>Places text before the switch.</ms-choice-hint>
      </ms-switch-control>
    </ms-switch-group>
  \`,
})
export class ClassicSwitchExample {}`;
}
