import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CheckboxControl,
  CheckboxGroup,
  ChoiceError,
  ChoiceHint,
} from '../../../../shared/ui-lib/components/choice-controls';
import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-checkbox-group-showcase',
  imports: [CheckboxGroup, CheckboxControl, ChoiceHint, ChoiceError, ShowcaseCode],
  templateUrl: './checkbox-group-showcase.html',
  styleUrl: './checkbox-group-showcase.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CheckboxControl,
  CheckboxGroup,
  ChoiceError,
  ChoiceHint,
} from './shared/ui-lib';

@Component({
  selector: 'app-checkbox-group-example',
  imports: [CheckboxGroup, CheckboxControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-checkbox-group>
      <legend>Notifications</legend>

      <ms-checkbox-control>
        <input type="checkbox" checked />
        <label>Email updates</label>
        <ms-choice-hint>Send product and release notes.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" />
        <label>Weekly digest</label>
        <ms-choice-hint>Group activity into one summary.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" disabled />
        <label>Billing alerts</label>
        <ms-choice-hint>Managed by account owners.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" />
        <label>Terms agreement</label>
        <ms-choice-error>Accept the terms before continuing.</ms-choice-error>
      </ms-checkbox-control>

      <ms-checkbox-control slot="label-before">
        <input type="checkbox" />
        <label>Label before</label>
        <ms-choice-hint>Places text before the checkbox.</ms-choice-hint>
      </ms-checkbox-control>
    </ms-checkbox-group>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupExample {}`;
}
