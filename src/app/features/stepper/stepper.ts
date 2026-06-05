import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
import {
  StepComponent,
  StepperComponent,
  StepTitleDirective,
} from '../../shared/ui-lib/components/stepper';

@Component({
  selector: 'app-stepper',
  imports: [RouterLink, ShowcaseCode, StepperComponent, StepComponent, StepTitleDirective],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
})
export class Stepper {
  protected readonly controlledIndex = signal(0);

  protected readonly horizontalSnippet = `import { Component } from '@angular/core';

import { StepComponent, StepperComponent } from './shared/ui-lib';

@Component({
  selector: 'app-horizontal-stepper-example', imports: [StepperComponent, StepComponent], template: \`
    <ms-stepper>
      <ms-step title="Account" [completed]="true">
        <p>Collect account details and contact preferences.</p>
      </ms-step>

      <ms-step title="Billing">
        <p>Capture billing address and payment details.</p>
      </ms-step>

      <ms-step title="Review">
        <p>Review details before submitting the workflow.</p>
      </ms-step>
    </ms-stepper>
  \`, })
export class HorizontalStepperExample {}`;

  protected readonly verticalSnippet = `import { Component } from '@angular/core';

import { StepComponent, StepperComponent } from './shared/ui-lib';

@Component({
  selector: 'app-vertical-stepper-example', imports: [StepperComponent, StepComponent], template: \`
    <ms-stepper orientation="vertical" [selectedIndex]="1">
      <ms-step title="Profile" [completed]="true">
        <p>Profile details are complete.</p>
      </ms-step>

      <ms-step title="Plan">
        <p>Select the plan that matches the workspace.</p>
      </ms-step>

      <ms-step title="Confirm">
        <p>Confirm the selected workspace options.</p>
      </ms-step>
    </ms-stepper>
  \`, })
export class VerticalStepperExample {}`;

  protected readonly linearSnippet = `import { Component, signal } from '@angular/core';

import { StepComponent, StepperComponent } from './shared/ui-lib';

@Component({
  selector: 'app-linear-stepper-example', imports: [StepperComponent, StepComponent], template: \`
    <ms-stepper [linear]="true" [(selectedIndex)]="selectedIndex">
      <ms-step title="Profile" [completed]="true">
        <p>Profile details are complete.</p>
        <button class="btn btn-primary" type="button" (click)="selectedIndex.set(1)">
          Continue
        </button>
      </ms-step>

      <ms-step title="Plan">
        <p>The review step remains blocked until this step is completed.</p>
      </ms-step>

      <ms-step title="Review">
        <p>Review is available after every prior enabled step is complete.</p>
      </ms-step>
    </ms-stepper>
  \`, })
export class LinearStepperExample {
  readonly selectedIndex = signal(0);
}`;

  protected readonly richTitleSnippet = `import { Component } from '@angular/core';

import { StepComponent, StepperComponent, StepTitleDirective, } from './shared/ui-lib';

@Component({
  selector: 'app-rich-title-stepper-example', imports: [StepperComponent, StepComponent, StepTitleDirective], template: \`
    <ms-stepper>
      <ms-step [completed]="true">
        <ng-template msStepTitle>
          Account <span class="badge">Done</span>
        </ng-template>

        <p>Account details passed review.</p>
      </ms-step>

      <ms-step>
        <ng-template msStepTitle>
          Billing <span class="status-dot" aria-hidden="true"></span>
        </ng-template>

        <p>Billing details are being edited.</p>
      </ms-step>

      <ms-step title="Review">
        <p>Review all entered information.</p>
      </ms-step>
    </ms-stepper>
  \`, })
export class RichTitleStepperExample {}`;

  protected readonly disabledSnippet = `import { Component } from '@angular/core';

import { StepComponent, StepperComponent } from './shared/ui-lib';

@Component({
  selector: 'app-disabled-stepper-example', imports: [StepperComponent, StepComponent], template: \`
    <ms-stepper orientation="vertical">
      <ms-step title="Workspace" [completed]="true">
        <p>Workspace setup is complete.</p>
      </ms-step>

      <ms-step title="Invite team">
        <p>Invite editors and reviewers before launch.</p>
      </ms-step>

      <ms-step title="Launch" [disabled]="true">
        <p>Launch is unavailable until team invites are sent.</p>
      </ms-step>
    </ms-stepper>
  \`, })
export class DisabledStepperExample {}`;

  protected readonly keyboardSnippet = `import { Component } from '@angular/core';

import { StepComponent, StepperComponent } from './shared/ui-lib';

@Component({
  selector: 'app-keyboard-stepper-example',
  imports: [StepperComponent, StepComponent],
  template: \`
    <div dir="rtl">
      <ms-stepper>
        <ms-step title="First">
          <p>Use left and right arrow keys to move through steps in this RTL container.</p>
        </ms-step>

        <ms-step title="Second">
          <p>Inline arrow navigation mirrors the surrounding direction.</p>
        </ms-step>

        <ms-step title="Third">
          <p>Home focuses the first step and End focuses the last step.</p>
        </ms-step>
      </ms-stepper>
    </div>
  \`,
})
export class KeyboardStepperExample {}`;
}
