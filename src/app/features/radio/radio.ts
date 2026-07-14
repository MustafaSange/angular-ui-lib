import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ChoiceError,
  ChoiceHint,
  RadioControl,
  RadioGroup,
} from '../../shared/ui-lib/components/choice-controls';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-radio',
  imports: [RouterLink, RadioGroup, RadioControl, ChoiceHint, ChoiceError, ShowcaseCode],
  templateUrl: './radio.html',
  styleUrl: './radio.scss',
})
export class Radio {
  protected readonly snippet = `import { Component } from '@angular/core';

import {
  ChoiceError,
  ChoiceHint,
  RadioControl,
  RadioGroup,
} from './shared/ui-lib';

@Component({
  selector: 'app-radio-group-example',
  imports: [RadioGroup, RadioControl, ChoiceHint, ChoiceError],
  template: \`
    <ms-radio-group>
      <legend>Support plan</legend>

      <ms-radio-control>
        <input type="radio" name="support-plan" value="starter" />
        <label>Starter</label>
        <ms-choice-hint>For small teams getting set up.</ms-choice-hint>
      </ms-radio-control>

      <ms-radio-control>
        <input type="radio" name="support-plan" value="growth" checked />
        <label>Growth</label>
        <ms-choice-hint>Priority support for active teams.</ms-choice-hint>
      </ms-radio-control>

      <ms-radio-control>
        <input type="radio" name="support-plan" value="enterprise" disabled />
        <label>Enterprise</label>
        <ms-choice-error>Contact sales to enable this plan.</ms-choice-error>
      </ms-radio-control>

      <ms-radio-control slot="label-before">
        <input type="radio" name="support-plan" value="custom" />
        <label>Label before</label>
        <ms-choice-hint>Places text before the radio.</ms-choice-hint>
      </ms-radio-control>
    </ms-radio-group>
  \`,
})
export class RadioGroupExample {}`;
}
