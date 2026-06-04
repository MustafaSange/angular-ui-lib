import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
  selector: 'ms-modal-outlet',
  imports: [NgComponentOutlet],
  templateUrl: './modal-outlet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalOutletComponent {
  private readonly modalService = inject(ModalService);

  protected readonly entries = this.modalService.entries;
}
