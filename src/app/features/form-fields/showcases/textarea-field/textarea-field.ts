import { Component, computed, signal } from '@angular/core';
import { FormField, form, maxLength, schema } from '@angular/forms/signals';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';
import { SignalFormField } from '../../../../shared/ui-lib/components/signal-form-field';

type TextareaFieldForm = {
  bio: string;
};

@Component({
  selector: 'app-textarea-field-showcase',
  imports: [FormField, SignalFormField, ShowcaseCode],
  templateUrl: './textarea-field.html',
  styleUrl: './textarea-field.scss',
  host: { class: 'showcase-pair' },
})
export class TextareaFieldShowcase {
  protected readonly snippet = `import { Component, computed, signal } from '@angular/core';
import { FormField, form, maxLength, schema } from '@angular/forms/signals';

import { SignalFormField } from './shared/ui-lib';

type ProfileForm = {
  bio: string;
};

@Component({
  selector: 'app-textarea-field-example',
  imports: [FormField, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="bio">Bio</label>
      <span slot="label-extra">{{ characterCount() }} / 280</span>
      <textarea
        id="bio"
        placeholder="Tell us a little about yourself"
        [formField]="bioField"
      ></textarea>
    </ms-signal-form-field>
  \`,
})
export class TextareaFieldExample {
  private readonly model = signal<ProfileForm>({
    bio: '',
  });

  protected readonly form = form(
    this.model,
    schema<ProfileForm>((path) => {
      maxLength(path.bio, 280);
    }),
  );

  protected readonly bioField = this.form.bio;
  protected readonly characterCount = computed(() => this.bioField().controlValue().length);
}`;

  private readonly model = signal<TextareaFieldForm>({
    bio: '',
  });

  protected readonly form = form(
    this.model,
    schema<TextareaFieldForm>((path) => {
      maxLength(path.bio, 280);
    }),
  );

  protected readonly bioField = this.form.bio;
  protected readonly characterCount = computed(() => this.bioField().controlValue().length);
}
