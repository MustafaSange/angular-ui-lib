import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CheckboxControl,
  CheckboxGroup,
  ChoiceError,
  ChoiceHint,
} from '../../shared/ui-lib/components/choice-controls';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-checkbox',
  imports: [RouterLink, CheckboxGroup, CheckboxControl, ChoiceHint, ChoiceError, ShowcaseCode],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  protected readonly snippet = `import { Component } from '@angular/core';

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
        <label>Email Updates</label>
        <ms-choice-hint>Send product and release notes.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" />
        <label>Weekly Digest</label>
        <ms-choice-hint>Group activity into one summary.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" disabled />
        <label>Billing Alerts</label>
        <ms-choice-hint>Managed by account owners.</ms-choice-hint>
      </ms-checkbox-control>

      <ms-checkbox-control>
        <input type="checkbox" />
        <label>Terms Agreement</label>
        <ms-choice-error>Accept the terms before continuing.</ms-choice-error>
      </ms-checkbox-control>

      <ms-checkbox-control slot="label-before">
        <input type="checkbox" />
        <label>Label Before</label>
        <ms-choice-hint>Places text before the checkbox.</ms-choice-hint>
      </ms-checkbox-control>
    </ms-checkbox-group>
  \`,
})
export class CheckboxGroupExample {}`;
}
