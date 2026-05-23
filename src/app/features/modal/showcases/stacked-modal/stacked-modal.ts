import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalService } from '../../../../shared/components/modal';
import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-stacked-child-modal-content',
  templateUrl: './stacked-child-modal-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class StackedChildModalContent {}

@Component({
  selector: 'app-stacked-modal-content',
  templateUrl: './stacked-modal-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class StackedModalContent {
  private readonly modalService = inject(ModalService);

  protected openChild(): void {
    this.modalService.open(StackedChildModalContent, {
      title: 'Stacked child modal',
      data: {
        name: 'Nested workflow',
        owner: 'Product team',
      },
    });
  }
}

@Component({
  selector: 'app-stacked-modal-showcase',
  imports: [ShowcaseCode],
  templateUrl: './stacked-modal.html',
  styleUrl: './stacked-modal.scss',
  host: {
    class: 'modal-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedModalShowcase {
  private readonly modalService = inject(ModalService);

  protected readonly snippet = `this.modalService.open(StackedModalContent, {
  title: 'Parent modal',
});`;

  protected openStackedModal(): void {
    this.modalService.open(StackedModalContent, {
      title: 'Parent modal',
    });
  }
}
