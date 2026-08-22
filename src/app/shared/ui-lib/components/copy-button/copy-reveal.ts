import { Component, ElementRef, booleanAttribute, input, viewChild } from '@angular/core';

import { CopyButtonComponent } from './copy-button';
import type { CopyButtonKind, CopyButtonSize } from './copy-button-types';

@Component({
  selector: 'ms-copy-reveal',
  imports: [CopyButtonComponent],
  templateUrl: './copy-reveal.html',
})
export class CopyRevealComponent {
  readonly text = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | null>(null);
  readonly copiedLabel = input<string | null>(null);
  readonly failedLabel = input<string | null>(null);
  readonly resetDelay = input(2000);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly kind = input<CopyButtonKind>('ghost');
  readonly size = input<CopyButtonSize>('sm');

  private readonly content = viewChild<ElementRef<HTMLElement>>('content');

  protected copyText(): string | undefined {
    const text = this.text();

    if (text !== undefined) {
      return text;
    }

    return this.content()?.nativeElement.textContent?.trim();
  }
}
