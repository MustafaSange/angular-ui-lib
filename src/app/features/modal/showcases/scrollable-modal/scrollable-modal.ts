import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ModalComponent } from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-scrollable-modal-showcase',
  imports: [ModalComponent, ShowcaseCode],
  templateUrl: './scrollable-modal.html',
  styleUrl: './scrollable-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollableModalShowcase {
  protected readonly isOpen = signal(false);
  protected readonly items = Array.from({ length: 18 }, (_, index) => index + 1);

  protected readonly snippet = `@if (isOpen()) {
  <ms-modal title="Scrollable content" width="42rem" (close)="isOpen.set(false)">
    <div class="modal-stack">
      @for (item of items; track item) {
        <p>
          {{ item }}. Long content keeps the modal body scrollable while the header and footer
          remain fixed inside the modal container.
        </p>
      }
    </div>

    <div slot="footer">
      <button class="btn btn-primary" type="button" (click)="isOpen.set(false)">Close</button>
    </div>
  </ms-modal>
}`;
}
