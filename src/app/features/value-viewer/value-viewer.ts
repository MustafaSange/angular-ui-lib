import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';
import { ValueViewerComponent, ValueViewerService } from '../../shared/ui-lib';

type CircularValue = {
  name: string;
  self?: CircularValue;
};

function createCircularValue(): CircularValue {
  const value: CircularValue = { name: 'Circular value' };
  value.self = value;
  return value;
}

@Component({
  selector: 'app-value-viewer',
  imports: [RouterLink, ShowcaseCode, ValueViewerComponent],
  templateUrl: './value-viewer.html',
  styleUrl: './value-viewer.scss',
})
export class ValueViewer {
  private readonly valueViewer = inject(ValueViewerService);

  protected readonly declarativeOpen = signal(false);
  protected readonly rtlOpen = signal(false);
  protected readonly multilineValue = `Angular makes enterprise applications approachable.
The value viewer can search Angular content without generating HTML.
Use Enter and Shift+Enter to move through every ANGULAR match.`;
  protected readonly apiResponse = {
    project: 'UI library',
    version: 22,
    capabilities: ['modal', 'clipboard', 'signal forms', 'highlighting'],
    metadata: {
      environment: 'showcase',
      active: true,
    },
  };
  protected readonly requestLog = `Started request REF-2026-0042
Validated request payload
Completed request REF-2026-0042`;
  protected readonly rtlValue = 'Angular يدعم تخطيطات RTL. ابحث عن Angular للتنقل بين النتائج.';

  protected readonly serviceTextSnippet = `import { Component, inject } from '@angular/core';

import { ModalOutletComponent, ValueViewerService } from './shared/ui-lib';

@Component({
  selector: 'app-text-value-viewer-example',
  imports: [ModalOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="openViewer()">
      View Text
    </button>
    <ms-modal-outlet />
  \`,
})
export class TextValueViewerExample {
  private readonly valueViewer = inject(ValueViewerService);
  private readonly value = \`Angular makes enterprise applications approachable.
The value viewer can search Angular content without generating HTML.
Use Enter and Shift+Enter to move through every ANGULAR match.\`;

  protected openViewer(): void {
    this.valueViewer.open(this.value, { title: 'Searchable Text' });
  }
}`;

  protected readonly objectSnippet = `import { Component, inject } from '@angular/core';

import { ModalOutletComponent, ValueViewerService } from './shared/ui-lib';

@Component({
  selector: 'app-object-value-viewer-example',
  imports: [ModalOutletComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="openResponse()">
      View API Response
    </button>
    <ms-modal-outlet />
  \`,
})
export class ObjectValueViewerExample {
  private readonly valueViewer = inject(ValueViewerService);
  private readonly response = {
    project: 'UI library',
    version: 22,
    capabilities: ['modal', 'clipboard', 'signal forms', 'highlighting'],
    metadata: { environment: 'showcase', active: true },
  };

  protected openResponse(): void {
    this.valueViewer.open(this.response, {
      title: 'API Response',
      width: '56rem',
      maxHeight: '80svh',
    });
  }
}`;

  protected readonly declarativeSnippet = `import { Component, signal } from '@angular/core';

import { ValueViewerComponent } from './shared/ui-lib';

@Component({
  selector: 'app-declarative-value-viewer-example',
  imports: [ValueViewerComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="open.set(true)">
      View Request Log
    </button>

    @if (open()) {
      <ms-value-viewer
        title="Request Log"
        [value]="requestLog"
        (close)="open.set(false)"
      />
    }
  \`,
})
export class DeclarativeValueViewerExample {
  readonly open = signal(false);
  readonly requestLog = \`Started request REF-2026-0042
Validated request payload
Completed request REF-2026-0042\`;
}`;

  protected readonly edgeCasesSnippet = `import { Component, inject } from '@angular/core';

import { ModalOutletComponent, ValueViewerService } from './shared/ui-lib';

type CircularValue = { name: string; self?: CircularValue };

@Component({
  selector: 'app-value-viewer-edge-cases-example',
  imports: [ModalOutletComponent],
  template: \`
    <button class="btn btn-outline" type="button" (click)="open('Empty Value', '')">
      Empty Value
    </button>
    <button class="btn btn-outline" type="button" (click)="open('Null Value', null)">
      Null Value
    </button>
    <button class="btn btn-outline" type="button" (click)="open('Undefined Value', undefined)">
      Undefined Value
    </button>
    <button class="btn btn-outline" type="button" (click)="open('JSON String', jsonString)">
      JSON String
    </button>
    <button class="btn btn-outline" type="button" (click)="open('Literal Search', literalText)">
      Literal Search
    </button>
    <button class="btn btn-outline" type="button" (click)="open('HTML-Like Text', htmlLikeText)">
      HTML-Like Text
    </button>
    <button class="btn btn-outline" type="button" (click)="open('Circular Value', circularValue)">
      Circular Value
    </button>
    <ms-modal-outlet />
  \`,
})
export class ValueViewerEdgeCasesExample {
  private readonly viewer = inject(ValueViewerService);
  protected readonly jsonString = '{"name":"Angular","active":true}';
  protected readonly literalText = 'Price is $5.00 + tax. Search for $5.00 + tax.';
  protected readonly htmlLikeText = "<script>alert('example')</script> remains inert text.";
  protected readonly circularValue: CircularValue = { name: 'Circular value' };

  constructor() {
    this.circularValue.self = this.circularValue;
  }

  protected open(title: string, value: unknown): void {
    this.viewer.open(value, { title });
  }
}`;

  protected readonly rtlSnippet = `import { Component, signal } from '@angular/core';

import { ValueViewerComponent } from './shared/ui-lib';

@Component({
  selector: 'app-rtl-value-viewer-example',
  imports: [ValueViewerComponent],
  template: \`
    <div dir="rtl">
      <button class="btn btn-primary" type="button" (click)="open.set(true)">
        Open RTL Viewer
      </button>

      @if (open()) {
        <ms-value-viewer
          title="RTL Value Viewer"
          [value]="value"
          (close)="open.set(false)"
        />
      }
    </div>
  \`,
})
export class RtlValueViewerExample {
  readonly open = signal(false);
  readonly value = 'Angular يدعم تخطيطات RTL. ابحث عن Angular للتنقل بين النتائج.';
}`;

  protected openTextViewer(): void {
    this.valueViewer.open(this.multilineValue, { title: 'Searchable Text' });
  }

  protected openObjectViewer(): void {
    this.valueViewer.open(this.apiResponse, {
      title: 'API Response',
      width: '56rem',
      maxHeight: '80svh',
    });
  }

  protected openEdgeCase(title: string, value: unknown): void {
    this.valueViewer.open(value, { title });
  }

  protected readonly jsonString = '{"name":"Angular","active":true}';
  protected readonly literalText = 'Price is $5.00 + tax. Search for $5.00 + tax.';
  protected readonly htmlLikeText = "<script>alert('example')</script> remains inert text.";
  protected readonly circularValue = createCircularValue();
}
