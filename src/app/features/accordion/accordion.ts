import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTitleDirective,
} from '../../shared/ui-lib/components/accordion';
import { BadgeComponent } from '../../shared/ui-lib/components/badge';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-accordion',
  imports: [
    RouterLink,
    ShowcaseCode,
    AccordionComponent,
    AccordionItemComponent,
    AccordionTitleDirective,
    BadgeComponent,
  ],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
})
export class Accordion {
  protected readonly basicSnippet = `import { Component } from '@angular/core';

import { AccordionComponent, AccordionItemComponent } from './shared/ui-lib';

@Component({
  selector: 'app-basic-accordion-example', imports: [AccordionComponent, AccordionItemComponent], template: \`
    <ms-accordion>
      <ms-accordion-item title="Account settings" [expanded]="true">
        <p>Manage profile details, sign-in methods, and notification preferences.</p>
      </ms-accordion-item>

      <ms-accordion-item title="Workspace access">
        <p>Review member roles, pending invites, and approval requirements.</p>
      </ms-accordion-item>

      <ms-accordion-item title="Billing">
        <p>Update payment methods, invoices, and renewal settings.</p>
      </ms-accordion-item>
    </ms-accordion>
  \`, })
export class BasicAccordionExample {}`;

  protected readonly compactSnippet = `import { Component } from '@angular/core';

import { AccordionComponent, AccordionItemComponent } from './shared/ui-lib';

@Component({
  selector: 'app-compact-accordion-example', imports: [AccordionComponent, AccordionItemComponent], template: \`
    <ms-accordion class="accordion-compact">
      <ms-accordion-item title="Profile" [expanded]="true">
        <p>Review account identity, language, and display settings.</p>
      </ms-accordion-item>

      <ms-accordion-item title="Security">
        <p>Manage password, active sessions, and two-step verification.</p>
      </ms-accordion-item>

      <ms-accordion-item title="Notifications">
        <p>Choose product, billing, and workspace email preferences.</p>
      </ms-accordion-item>
    </ms-accordion>
  \`, })
export class CompactAccordionExample {}`;

  protected readonly multipleSnippet = `import { Component } from '@angular/core';

import { AccordionComponent, AccordionItemComponent, AccordionTitleDirective, BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-multiple-accordion-example', imports: [AccordionComponent, AccordionItemComponent, AccordionTitleDirective, BadgeComponent], template: \`
    <ms-accordion [multiple]="true">
      <ms-accordion-item [expanded]="true">
        <ng-template msAccordionTitle>
          Deployment <ms-badge kind="success">Ready</ms-badge>
        </ng-template>

        <p>The release candidate passed validation and is ready to promote.</p>
      </ms-accordion-item>

      <ms-accordion-item [expanded]="true">
        <ng-template msAccordionTitle>
          Review <ms-badge kind="success" dot>Approved</ms-badge>
        </ng-template>

        <p>Two reviewers have approved the latest design token updates.</p>
      </ms-accordion-item>

      <ms-accordion-item title="Archive" [disabled]="true">
        <p>This section is unavailable until the active release is complete.</p>
      </ms-accordion-item>
    </ms-accordion>
  \`,
})
export class MultipleAccordionExample {}`;

  protected readonly keyboardSnippet = `import { Component } from '@angular/core';

import { AccordionComponent, AccordionItemComponent } from './shared/ui-lib';

@Component({
  selector: 'app-keyboard-accordion-example',
  imports: [AccordionComponent, AccordionItemComponent],
  template: \`
    <div dir="rtl">
      <ms-accordion>
        <ms-accordion-item title="First">
          <p>Use arrow keys to move between accordion headers in this RTL container.</p>
        </ms-accordion-item>

        <ms-accordion-item title="Second">
          <p>Left and right arrows mirror logical inline direction.</p>
        </ms-accordion-item>

        <ms-accordion-item title="Third">
          <p>Home focuses the first header and End focuses the last header.</p>
        </ms-accordion-item>
      </ms-accordion>
    </div>
  \`,
})
export class KeyboardAccordionExample {}`;
}
