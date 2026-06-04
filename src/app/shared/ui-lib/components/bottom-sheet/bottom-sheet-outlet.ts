import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BottomSheetService } from './bottom-sheet.service';

@Component({
  selector: 'ms-bottom-sheet-outlet',
  imports: [NgComponentOutlet],
  templateUrl: './bottom-sheet-outlet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetOutletComponent {
  private readonly bottomSheetService = inject(BottomSheetService);

  protected readonly entries = this.bottomSheetService.entries;
}
