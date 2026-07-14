import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  BOTTOM_SHEET_DATA,
  BOTTOM_SHEET_REF,
  BottomSheetClose,
  BottomSheetComponent,
  BottomSheetRef,
  BottomSheetService,
  BottomSheetTrigger,
} from '../../shared/ui-lib/components/bottom-sheet';
import { ShowcaseCode } from '../../shared/showcase-code';

type ShareSheetData = {
  projectId: string;
};

type ShareSheetResult =
  | {
      action: 'copy-link';
    }
  | {
      action: 'cancel';
    };

@Component({
  selector: 'app-share-bottom-sheet',
  imports: [BottomSheetComponent],
  template: `
    <ms-bottom-sheet
      title="Share project"
      size="compact"
      (close)="sheetRef.close({ action: 'cancel' })"
    >
      <p class="service-sheet-copy">Share {{ data.projectId }} with your team.</p>

      <div slot="footer" class="bottom-sheet-footer">
        <button
          class="btn btn-secondary btn-full"
          type="button"
          (click)="sheetRef.close({ action: 'cancel' })"
        >
          Cancel
        </button>
        <button class="btn btn-primary btn-full" type="button" (click)="copyLink()">
          Copy link
        </button>
      </div>
    </ms-bottom-sheet>
  `,
})
export class ShareBottomSheet {
  protected readonly data = inject(BOTTOM_SHEET_DATA) as ShareSheetData;
  protected readonly sheetRef = inject(BOTTOM_SHEET_REF) as BottomSheetRef<ShareSheetResult>;

  protected copyLink(): void {
    this.sheetRef.close({ action: 'copy-link' });
  }
}

@Component({
  selector: 'app-bottom-sheet',
  imports: [
    BottomSheetClose,
    BottomSheetComponent,
    BottomSheetTrigger,
    ReactiveFormsModule,
    RouterLink,
    ShowcaseCode,
  ],
  templateUrl: './bottom-sheet.html',
  styleUrl: './bottom-sheet.scss',
})
export class BottomSheet {
  private readonly bottomSheetService = inject(BottomSheetService);

  protected readonly actionsOpen = signal(false);
  protected readonly compactOpen = signal(false);
  protected readonly formOpen = signal(false);
  protected readonly fullOpen = signal(false);
  protected readonly lockedOpen = signal(false);
  protected readonly rtlOpen = signal(false);
  protected readonly serviceResult = signal('No service result yet');
  protected readonly projectName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  protected readonly actionsSnippet = `import { Component, signal } from '@angular/core';

import { BottomSheetClose, BottomSheetComponent, BottomSheetTrigger, } from './shared/ui-lib';

@Component({
  selector: 'app-bottom-sheet-actions-example', imports: [BottomSheetClose, BottomSheetComponent, BottomSheetTrigger], template: \`
    <button class="btn btn-primary" type="button" [msBottomSheetTrigger]="sheet">
      Open actions
    </button>

    <ms-bottom-sheet #sheet="msBottomSheet" [(open)]="isOpen" title="Project actions">
      <div class="action-list">
        <button class="btn btn-ghost btn-full" type="button" msBottomSheetClose>
          Rename project
        </button>
        <button class="btn btn-ghost btn-full" type="button" msBottomSheetClose>
          Duplicate project
        </button>
        <button class="btn btn-ghost btn-full" type="button" msBottomSheetClose>
          Archive project
        </button>
      </div>

      <div slot="footer">
        <button class="btn btn-secondary btn-full" type="button" msBottomSheetClose>
          Cancel
        </button>
      </div>
    </ms-bottom-sheet>
  \`,
  styles: [\`
    .action-list {
      display: grid;
      gap: 0.5rem;
    }
  \`],
})
export class BottomSheetActionsExample {
  protected readonly isOpen = signal(false);
}`;

  protected readonly compactSnippet = `import { Component, signal } from '@angular/core';

import { BottomSheetClose, BottomSheetComponent, BottomSheetTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-compact-bottom-sheet-example', imports: [BottomSheetClose, BottomSheetComponent, BottomSheetTrigger], template: \`
    <button class="btn btn-outline" type="button" [msBottomSheetTrigger]="sheet">
      Open compact sheet
    </button>

    <ms-bottom-sheet #sheet="msBottomSheet" [(open)]="open" title="Quick note" size="compact">
      <p>Compact sheets fit short confirmations and action groups.</p>
      <div slot="footer">
        <button class="btn btn-primary btn-full" type="button" msBottomSheetClose>
          Done
        </button>
      </div>
    </ms-bottom-sheet>
  \`, })
export class CompactBottomSheetExample {
  protected readonly open = signal(false);
}`;

  protected readonly formSnippet = `import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { BottomSheetClose, BottomSheetComponent, BottomSheetTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-form-bottom-sheet-example', imports: [BottomSheetClose, BottomSheetComponent, BottomSheetTrigger, ReactiveFormsModule], template: \`
    <button class="btn btn-outline" type="button" [msBottomSheetTrigger]="sheet">
      Rename project
    </button>

    <ms-bottom-sheet #sheet="msBottomSheet" [(open)]="open" title="Rename project">
      <label class="form-field">
        <span class="form-label">Project name</span>
        <input class="input" type="text" [formControl]="name" />
      </label>

      <div slot="footer">
        <button class="btn btn-secondary" type="button" msBottomSheetClose>Cancel</button>
        <button class="btn btn-primary" type="button" [disabled]="name.invalid" msBottomSheetClose>
          Save
        </button>
      </div>
    </ms-bottom-sheet>
  \`, })
export class FormBottomSheetExample {
  protected readonly open = signal(false);
  protected readonly name = new FormControl('', {
    nonNullable: true, validators: [Validators.required, Validators.minLength(3)], });
}`;

  protected readonly fullSnippet = `import { Component, signal } from '@angular/core';

import { BottomSheetClose, BottomSheetComponent, BottomSheetTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-full-bottom-sheet-example', imports: [BottomSheetClose, BottomSheetComponent, BottomSheetTrigger], template: \`
    <button class="btn btn-outline" type="button" [msBottomSheetTrigger]="sheet">
      Open mobile workflow
    </button>

    <ms-bottom-sheet #sheet="msBottomSheet" [(open)]="open" title="Review changes" size="full">
      <div class="review-list">
        <p>Profile details</p>
        <p>Notification settings</p>
        <p>Team permissions</p>
      </div>

      <div slot="footer">
        <button class="btn btn-primary btn-full" type="button" msBottomSheetClose>
          Confirm
        </button>
      </div>
    </ms-bottom-sheet>
  \`,
  styles: [\`
    .review-list {
      display: grid;
      gap: 0.75rem;
    }
  \`],
})
export class FullBottomSheetExample {
  protected readonly open = signal(false);
}`;

  protected readonly lockedSnippet = `import { Component, signal } from '@angular/core';

import { BottomSheetClose, BottomSheetComponent, BottomSheetTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-locked-bottom-sheet-example', imports: [BottomSheetClose, BottomSheetComponent, BottomSheetTrigger], template: \`
    <button class="btn btn-outline" type="button" [msBottomSheetTrigger]="sheet">
      Open required choice
    </button>

    <ms-bottom-sheet
      #sheet="msBottomSheet"
      [(open)]="open"
      title="Required choice"
      [closeOnBackdrop]="false"
    >
      <p>Backdrop clicks stay inside the workflow. Use an explicit action to close.</p>
      <div slot="footer">
        <button class="btn btn-primary btn-full" type="button" msBottomSheetClose>
          I understand
        </button>
      </div>
    </ms-bottom-sheet>
  \`, })
export class LockedBottomSheetExample {
  protected readonly open = signal(false);
}`;

  protected readonly serviceSnippet = `import { Component, inject } from '@angular/core';

import { BOTTOM_SHEET_DATA, BOTTOM_SHEET_REF, BottomSheetComponent, BottomSheetRef, BottomSheetService, } from './shared/ui-lib';

type ShareSheetData = {
  projectId: string;
};

type ShareSheetResult =
  | {
      action: 'copy-link';
    }
  | {
      action: 'cancel';
    };

@Component({
  selector: 'app-share-sheet', imports: [BottomSheetComponent], template: \`
    <ms-bottom-sheet title="Share project" (close)="sheetRef.close({ action: 'cancel' })">
      <p>Share {{ data.projectId }} with your team.</p>

      <div slot="footer">
        <button class="btn btn-primary btn-full" type="button" (click)="copyLink()">
          Copy link
        </button>
      </div>
    </ms-bottom-sheet>
  \`, })
export class ShareSheetComponent {
  protected readonly data = inject(BOTTOM_SHEET_DATA) as ShareSheetData;
  protected readonly sheetRef = inject(BOTTOM_SHEET_REF) as BottomSheetRef<ShareSheetResult>;

  protected copyLink(): void {
    this.sheetRef.close({ action: 'copy-link' });
  }
}

@Component({
  selector: 'app-share-sheet-launcher', template: \`
    <button class="btn btn-primary" type="button" (click)="openShareSheet()">
      Open share sheet
    </button>
  \`, })
export class ShareSheetLauncher {
  private readonly bottomSheetService = inject(BottomSheetService);

  protected openShareSheet(): void {
    const sheetRef = this.bottomSheetService.open<
      ShareSheetComponent, ShareSheetData, ShareSheetResult
    >(ShareSheetComponent, {
      size: 'compact', data: {
        projectId: 'project-1', }, });

    sheetRef.afterClosed().subscribe((result) => {
      if (result?.action === 'copy-link') {
        // continue workflow
      }
    });
  }
}`;

  protected readonly rtlSnippet = `import { Component, signal } from '@angular/core';

import { BottomSheetClose, BottomSheetComponent, BottomSheetTrigger } from './shared/ui-lib';

@Component({
  selector: 'app-rtl-bottom-sheet-example',
  imports: [BottomSheetClose, BottomSheetComponent, BottomSheetTrigger],
  template: \`
    <div dir="rtl">
      <button class="btn btn-outline" type="button" [msBottomSheetTrigger]="sheet">
        افتح الإجراءات
      </button>

      <ms-bottom-sheet #sheet="msBottomSheet" [(open)]="open" title="إجراءات المشروع">
        <div class="action-list">
          <button class="btn btn-ghost btn-full" type="button" msBottomSheetClose>
            إعادة تسمية المشروع
          </button>
          <button class="btn btn-ghost btn-full" type="button" msBottomSheetClose>
            نسخ المشروع
          </button>
        </div>
      </ms-bottom-sheet>
    </div>
  \`,
  styles: [\`
    .action-list {
      display: grid;
      gap: 0.5rem;
    }
  \`],
})
export class RtlBottomSheetExample {
  protected readonly open = signal(false);
}`;

  protected openServiceSheet(): void {
    const sheetRef = this.bottomSheetService.open<
      ShareBottomSheet,
      ShareSheetData,
      ShareSheetResult
    >(ShareBottomSheet, {
      size: 'compact',
      data: {
        projectId: 'project-1',
      },
    });

    sheetRef.afterClosed().subscribe((result) => {
      this.serviceResult.set(result ? `Closed with ${result.action}` : 'Closed without a result');
    });
  }
}
