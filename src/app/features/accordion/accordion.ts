import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTitleDirective,
} from '../../shared/components/accordion';
import { ShowcaseCode } from '../../shared/components/showcase-code';

@Component({
  selector: 'app-accordion',
  imports: [
    RouterLink,
    ShowcaseCode,
    AccordionComponent,
    AccordionItemComponent,
    AccordionTitleDirective,
  ],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accordion {
  protected readonly basicSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AccordionComponent, AccordionItemComponent } from './shared/components/accordion';

@Component({
  selector: 'app-basic-accordion-example',
  imports: [AccordionComponent, AccordionItemComponent],
  template: \`
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
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicAccordionExample {}`;

  protected readonly multipleSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTitleDirective,
} from './shared/components/accordion';

@Component({
  selector: 'app-multiple-accordion-example',
  imports: [AccordionComponent, AccordionItemComponent, AccordionTitleDirective],
  template: \`
    <ms-accordion [multiple]="true">
      <ms-accordion-item [expanded]="true">
        <ng-template msAccordionTitle>
          Deployment <span class="badge">Ready</span>
        </ng-template>

        <p>The release candidate passed validation and is ready to promote.</p>
      </ms-accordion-item>

      <ms-accordion-item [expanded]="true">
        <ng-template msAccordionTitle>
          Review <span class="status-dot" aria-hidden="true"></span>
        </ng-template>

        <p>Two reviewers have approved the latest design token updates.</p>
      </ms-accordion-item>

      <ms-accordion-item title="Archive" [disabled]="true">
        <p>This section is unavailable until the active release is complete.</p>
      </ms-accordion-item>
    </ms-accordion>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleAccordionExample {}`;

  protected readonly keyboardSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AccordionComponent, AccordionItemComponent } from './shared/components/accordion';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardAccordionExample {}`;
}
