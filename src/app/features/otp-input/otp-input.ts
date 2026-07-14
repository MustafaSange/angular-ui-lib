import { Component, computed, signal } from '@angular/core';
import { FormField, form, minLength, schema } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import {
  OtpInputComponent,
  SignalFormField,
  SignalFormHint,
} from '../../shared/ui-lib';
import { ShowcaseCode } from '../../shared/showcase-code';

type VerificationForm = {
  code: string;
};

@Component({
  selector: 'app-otp-input',
  imports: [
    FormField,
    OtpInputComponent,
    RouterLink,
    ShowcaseCode,
    SignalFormField,
    SignalFormHint,
  ],
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.scss',
})
export class OtpInput {
  private readonly verificationFormModel = signal<VerificationForm>({
    code: '',
  });

  protected readonly verificationForm = form(
    this.verificationFormModel,
    schema<VerificationForm>((path) => {
      minLength(path.code, 6);
    }),
  );

  protected readonly numericCode = signal('');
  protected readonly accessCode = signal('');
  protected readonly recoveryCode = signal('');
  protected readonly formCodeField = this.verificationForm.code;
  protected readonly completedCode = signal('');
  protected readonly numericStatus = computed(() =>
    this.completedCode() ? `Ready to submit ${this.completedCode()}` : 'Waiting for 6 digits',
  );

  protected handleComplete(code: string): void {
    this.completedCode.set(code);
  }

  protected readonly numericSnippet = `import { Component, signal } from '@angular/core';

import { OtpInputComponent } from './shared/ui-lib';

@Component({
  selector: 'app-otp-example',
  imports: [OtpInputComponent],
  template: \`
    <ms-otp-input
      [(value)]="code"
      length="6"
      aria-label="Verification code"
      (complete)="submitCode($event)"
    />
  \`,
})
export class OtpExample {
  protected readonly code = signal('');

  protected submitCode(code: string): void {
    console.log(code);
  }
}`;

  protected readonly alphanumericSnippet = `import { Component, signal } from '@angular/core';

import { OtpInputComponent } from './shared/ui-lib';

@Component({
  selector: 'app-access-code-example',
  imports: [OtpInputComponent],
  template: \`
    <ms-otp-input
      [(value)]="accessCode"
      length="4"
      mode="alphanumeric"
      aria-label="Access code"
    />
  \`,
})
export class AccessCodeExample {
  protected readonly accessCode = signal('');
}`;

  protected readonly pasteSnippet = `import { Component, signal } from '@angular/core';

import { OtpInputComponent } from './shared/ui-lib';

@Component({
  selector: 'app-recovery-code-example',
  imports: [OtpInputComponent],
  template: \`
    <ms-otp-input
      [(value)]="recoveryCode"
      length="8"
      mode="alphanumeric"
      aria-label="Recovery code"
    />
  \`,
})
export class RecoveryCodeExample {
  protected readonly recoveryCode = signal('');
}`;

  protected readonly signalFormSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, minLength, schema } from '@angular/forms/signals';

import { OtpInputComponent, SignalFormField, SignalFormHint } from './shared/ui-lib';

type VerificationForm = {
  code: string;
};

@Component({
  selector: 'app-form-field-otp-example',
  imports: [FormField, OtpInputComponent, SignalFormField, SignalFormHint],
  template: \`
    <ms-signal-form-field>
      <label id="code-label">Verification code</label>
      <ms-otp-input [formField]="codeField" length="6" aria-labelledby="code-label" />
      <ms-hint>Paste or type the 6-digit code.</ms-hint>
    </ms-signal-form-field>
  \`,
})
export class FormFieldOtpExample {
  private readonly model = signal<VerificationForm>({
    code: '',
  });

  protected readonly form = form(
    this.model,
    schema<VerificationForm>((path) => {
      minLength(path.code, 6);
    }),
  );

  protected readonly codeField = this.form.code;
}`;

  protected readonly disabledSnippet = `import { Component } from '@angular/core';

import { OtpInputComponent } from './shared/ui-lib';

@Component({
  selector: 'app-disabled-otp-example',
  imports: [OtpInputComponent],
  template: \`
    <ms-otp-input value="123456" length="6" aria-label="Disabled verification code" disabled />
    <ms-otp-input value="A1B2" length="4" mode="alphanumeric" aria-label="Readonly access code" readonly />
  \`,
})
export class DisabledOtpExample {}`;
}
