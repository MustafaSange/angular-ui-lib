import { Component, inject } from '@angular/core';

import {
  MODAL_DATA,
  MODAL_REF,
  ModalComponent,
  ModalRef,
  ModalService,
} from '../../../../shared/ui-lib/components/modal';
import type { ModalSize } from '../../../../shared/ui-lib/components/modal';
import { ShowcaseCode } from '../../../../shared/showcase-code';

type SizePresetModalData = {
  label: string;
  description: string;
};

const SIZE_LABELS: Record<ModalSize, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
  fullscreen: 'Fullscreen',
};

@Component({
  selector: 'app-size-preset-modal-content',
  imports: [ModalComponent],
  template: `
    <ms-modal [title]="data.label + ' Modal'">
      <div class="modal-stack">
        <p>{{ data.description }}</p>
        <p>
          Preset dimensions remain responsive, while explicit width options can override them for
          custom layouts.
        </p>
      </div>

      <div slot="footer">
        <button class="btn btn-primary" type="button" (click)="modalRef.close(undefined, 'action')">
          Close
        </button>
      </div>
    </ms-modal>
  `,
})
class SizePresetModalContent {
  protected readonly data = inject(MODAL_DATA) as SizePresetModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-size-presets-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './size-presets-modal.html',
  styleUrl: './size-presets-modal.scss',
  host: {
    class: 'modal-section',
  },
})
export class SizePresetsModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `import { Component, inject } from '@angular/core';

import { MODAL_DATA, MODAL_REF, ModalComponent, ModalRef, ModalService } from './shared/ui-lib';
import type { ModalSize } from './shared/ui-lib';

type PresetModalData = {
  label: string;
  description: string;
};

const SIZE_LABELS: Record<ModalSize, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
  fullscreen: 'Fullscreen',
};

@Component({
  selector: 'app-preset-modal',
  imports: [ModalComponent],
  template: \`
    <ms-modal [title]="data.label + ' Modal'">
      <div class="modal-stack">
        <p>{{ data.description }}</p>
        <p>
          Preset dimensions remain responsive, while explicit width options can override them for
          custom layouts.
        </p>
      </div>

      <div slot="footer">
        <button
          class="btn btn-primary"
          type="button"
          (click)="modalRef.close(undefined, 'action')"
        >
          Close
        </button>
      </div>
    </ms-modal>
  \`,
})
export class PresetModal {
  protected readonly data = inject(MODAL_DATA) as PresetModalData;
  protected readonly modalRef = inject(MODAL_REF) as ModalRef<void>;
}

@Component({
  selector: 'app-modal-size-example',
  template: \`
    <button class="btn btn-secondary" type="button" (click)="openPreset('sm')">Small</button>
    <button class="btn btn-secondary" type="button" (click)="openPreset('md')">Medium</button>
    <button class="btn btn-secondary" type="button" (click)="openPreset('lg')">Large</button>
    <button class="btn btn-secondary" type="button" (click)="openPreset('xl')">Extra Large</button>
    <button class="btn btn-secondary" type="button" (click)="openPreset('fullscreen')">
      Fullscreen
    </button>
    <button class="btn btn-primary" type="button" (click)="openCustomWidth()">
      Custom Width
    </button>
  \`,
})
export class ModalSizeExample {
  private readonly modalService = inject(ModalService);

  protected openPreset(size: ModalSize): void {
    const label = SIZE_LABELS[size];

    this.modalService.open<PresetModal, PresetModalData>(PresetModal, {
      size,
      data: {
        label,
        description: \`The \${label.toLowerCase()} preset was selected.\`,
      },
    });
  }

  protected openCustomWidth(): void {
    this.modalService.open<PresetModal, PresetModalData>(PresetModal, {
      size: 'lg',
      width: '42rem',
      maxWidth: 'calc(100vi - 2rem)',
      data: {
        label: 'Custom Width',
        description: 'Explicit width and maxWidth override the selected preset dimensions.',
      },
    });
  }
}`;

  protected openPreset(size: ModalSize): void {
    const label = SIZE_LABELS[size];

    this.modalService.open<SizePresetModalContent, SizePresetModalData>(SizePresetModalContent, {
      size,
      data: {
        label,
        description: `The ${label.toLowerCase()} preset was selected.`,
      },
    });
  }

  protected openCustomWidth(): void {
    this.modalService.open<SizePresetModalContent, SizePresetModalData>(SizePresetModalContent, {
      size: 'lg',
      width: '42rem',
      maxWidth: 'calc(100vi - 2rem)',
      data: {
        label: 'Custom Width',
        description: 'Explicit width and maxWidth override the selected preset dimensions.',
      },
    });
  }
}
