import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ChoiceError,
  ChoiceHint,
  SwitchControl,
  SwitchGroup,
} from '../../../../shared/components/choice-controls';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-switch-controls-showcase',
  imports: [SwitchGroup, SwitchControl, ChoiceHint, ChoiceError, ShowcaseCode],
  templateUrl: './switch-controls-showcase.html',
  styleUrl: './switch-controls-showcase.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchControlsShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ChoiceError,
  ChoiceHint,
  SwitchControl,
  SwitchGroup,
} from './shared/components/choice-controls';

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
        <label>Compact mode</label>
        <ms-choice-hint>Reduce spacing in dense views.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" disabled />
        <label>Audit logging</label>
        <ms-choice-hint>Available on enterprise plans.</ms-choice-hint>
      </ms-switch-control>

      <ms-switch-control>
        <input type="checkbox" role="switch" />
        <label>Public profile</label>
        <ms-choice-error>Review visibility settings before enabling.</ms-choice-error>
      </ms-switch-control>

      <ms-switch-control slot="label-before">
        <input type="checkbox" role="switch" />
        <label>Label before</label>
        <ms-choice-hint>Places text before the switch.</ms-choice-hint>
      </ms-switch-control>
    </ms-switch-group>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchControlsExample {}`;
}
