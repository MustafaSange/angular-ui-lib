import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ModalComponent } from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-declarative-modal-showcase',
  imports: [ModalComponent, ShowcaseCode],
  templateUrl: './declarative-modal.html',
  styleUrl: './declarative-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativeModalShowcase {
  protected readonly isOpen = signal(false);

  protected readonly snippet = `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ModalComponent } from './shared/components/modal';

@Component({
  selector: 'app-declarative-modal-example',
  imports: [ModalComponent],
  template: \`
    <button class="btn btn-primary" type="button" (click)="isOpen.set(true)">
      Open modal
    </button>

    @if (isOpen()) {
      <ms-modal title="Hello" (close)="isOpen.set(false)">
        <button slot="headerActions" class="btn btn-outline-primary btn-sm" type="button">
          Help
        </button>

        <p>Projected modal content.</p>

        <div slot="footer">
          <button class="btn btn-secondary" type="button" (click)="isOpen.set(false)">
            Cancel
          </button>
          <button class="btn btn-primary" type="button">
            Save
          </button>
        </div>
      </ms-modal>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativeModalExample {
  protected readonly isOpen = signal(false);
}`;
}
