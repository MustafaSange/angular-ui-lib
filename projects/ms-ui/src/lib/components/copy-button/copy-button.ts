import {
  Component,
  ElementRef,
  OnDestroy,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { copyTextToClipboard } from './copy-clipboard';
import { LanguageService } from '../../services/language';
import type { CopyButtonKind, CopyButtonSize, CopyClipboardResult } from './copy-button-types';

type CopyState = 'idle' | CopyClipboardResult;

@Component({
  selector: 'ms-copy-button',
  templateUrl: './copy-button.html',
  host: {
    '[attr.data-copy-state]': 'copyState()',
  },
})
export class CopyButtonComponent implements OnDestroy {
  readonly text = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | null>(null);
  readonly copiedLabel = input<string | null>(null);
  readonly failedLabel = input<string | null>(null);
  readonly resetDelay = input(2000);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly kind = input<CopyButtonKind>('ghost');
  readonly size = input<CopyButtonSize>('md');

  private readonly projectedContent = viewChild<ElementRef<HTMLElement>>('projectedContent');
  private readonly languageService = inject(LanguageService);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly copyState = signal<CopyState>('idle');

  protected readonly icon = computed(() => {
    switch (this.copyState()) {
      case 'copied':
        return 'check';
      case 'failed':
        return 'error';
      default:
        return 'content_copy';
    }
  });

  protected readonly currentLabel = computed(() => {
    switch (this.copyState()) {
      case 'copied':
        return this.copiedLabel() ?? this.languageService.translate('clipboard.copied');
      case 'failed':
        return this.failedLabel() ?? this.languageService.translate('clipboard.failed');
      default:
        return this.ariaLabel() ?? this.languageService.translate('clipboard.copy');
    }
  });

  protected readonly buttonClasses = computed(() => {
    const classes = ['btn', 'btn-icon', `btn-${this.size()}`];

    switch (this.kind()) {
      case 'outline':
        classes.push('btn-outline');
        break;
      case 'primary':
        classes.push('btn-primary');
        break;
      case 'secondary':
        classes.push('btn-secondary');
        break;
      default:
        classes.push('btn-ghost');
        break;
    }

    return classes.join(' ');
  });

  ngOnDestroy(): void {
    this.clearResetTimer();
  }

  protected async copy(): Promise<void> {
    if (this.disabled()) {
      return;
    }

    const result = await copyTextToClipboard(this.copyText());
    this.setCopyState(result);
  }

  private copyText(): string {
    const text = this.text();

    if (text !== undefined) {
      return text;
    }

    return this.projectedContent()?.nativeElement.textContent?.trim() ?? '';
  }

  private setCopyState(state: CopyClipboardResult): void {
    this.copyState.set(state);
    this.clearResetTimer();

    const delay = Math.max(0, this.resetDelay());

    this.resetTimer = setTimeout(() => {
      this.copyState.set('idle');
      this.resetTimer = undefined;
    }, delay);
  }

  private clearResetTimer(): void {
    if (!this.resetTimer) {
      return;
    }

    clearTimeout(this.resetTimer);
    this.resetTimer = undefined;
  }
}
