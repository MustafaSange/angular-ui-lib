import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ChoiceError,
  ChoiceHint,
  SwitchControl,
  SwitchGroup,
} from '../../shared/ui-lib/components/choice-controls';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-switch',
  imports: [RouterLink, SwitchGroup, SwitchControl, ChoiceHint, ChoiceError, ShowcaseCode],
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
})
export class Switch {
  protected readonly snippet = `import { Component } from '@angular/core';

import {
  ChoiceError,
  ChoiceHint,
  SwitchControl,
  SwitchGroup,
} from './shared/ui-lib';

@Component({
  selector: 'app-switch-controls-example',
  imports: [SwitchGroup, SwitchControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-switch-group>
      <legend>Preferences</legend>

      <ms-switch-control>
        <input type="checkbox" role="switch" checked />
        <label>Notifications</label>
        <ms-choice-hint>Push critical alerts immediately.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" />
        <label>Compact Mode</label>
        <ms-choice-hint>Reduce spacing in dense views.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" disabled />
        <label>Audit Logging</label>
        <ms-choice-hint>Available on enterprise plans.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" />
        <label>Public Profile</label>
        <ms-choice-error>Review visibility settings before enabling.</ms-choice-error>
      </ms-switch-control>

      <ms-switch-control slot="label-before">
        <input type="checkbox" role="switch" />
        <label>Label Before</label>
        <ms-choice-hint>Places text before the switch.</ms-choice-hint>
      </ms-switch-control>
    </ms-switch-group>
  \`,
})
export class SwitchControlsExample {}`;
}
