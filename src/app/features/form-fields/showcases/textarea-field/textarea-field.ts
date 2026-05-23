import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';
import { SignalFormField } from '../../../../shared/components/signal-form-field';

@Component({
  selector: 'app-textarea-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './textarea-field.html',
  styleUrl: './textarea-field.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFieldShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-textarea-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="bio">Bio</label>
      <span slot="label-extra">0 / 280</span>
      <textarea id="bio" placeholder="Tell us a little about yourself"></textarea>
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFieldExample {}`;
}
