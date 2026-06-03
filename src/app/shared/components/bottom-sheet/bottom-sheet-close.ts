import { Directive, inject } from '@angular/core';

import { BottomSheetComponent } from './bottom-sheet';

@Directive({
  selector: 'button[msBottomSheetClose], a[msBottomSheetClose]',
  host: {
    '(click)': 'closeSheet()',
  },
})
export class BottomSheetClose {
  private readonly sheet = inject(BottomSheetComponent);

  protected closeSheet(): void {
    this.sheet.dismiss();
  }
}
