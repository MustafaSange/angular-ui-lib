import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  input,
  viewChild,
} from '@angular/core';

import { CopyButtonComponent } from './copy-button';
import type { CopyButtonSize, CopyButtonVariant } from './copy-button-types';

@Component({
  selector: 'ms-copy-reveal',
  imports: [CopyButtonComponent],
  templateUrl: './copy-reveal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyRevealComponent {
  readonly text = input<string | undefined>(undefined);
  readonly ariaLabel = input('Copy to clipboard');
  readonly copiedLabel = input('Copied');
  readonly failedLabel = input('Copy failed');
  readonly resetDelay = input(2000);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<CopyButtonVariant>('ghost');
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
