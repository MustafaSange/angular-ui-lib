import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, input } from '@angular/core';

import { LanguageService } from '../../services/language';
import { LoadingService } from '../../services/loading';
import { ProgressIndicatorComponent, SpinnerComponent } from '../progress-indicator';
import type { SpinnerVariant } from '../progress-indicator/progress-indicator-types';
import type { LoadingIndicatorVariant } from './loading-indicator-types';

interface ManagedElementState {
  readonly ariaBusy: string | null;
  readonly inert: boolean;
}

interface BodyLockState {
  count: number;
  readonly preserveClass: boolean;
}

const bodyLocks = new WeakMap<Document, BodyLockState>();

function lockBody(document: Document): void {
  const state = bodyLocks.get(document) ?? {
    count: 0,
    preserveClass: document.body.classList.contains('ms-loading-blocked'),
  };

  state.count += 1;
  bodyLocks.set(document, state);
  document.body.classList.add('ms-loading-blocked');
}

function unlockBody(document: Document): void {
  const state = bodyLocks.get(document);

  if (!state) {
    return;
  }

  state.count = Math.max(state.count - 1, 0);

  if (state.count === 0) {
    if (!state.preserveClass) {
      document.body.classList.remove('ms-loading-blocked');
    }

    bodyLocks.delete(document);
  }
}

@Component({
  selector: 'ms-loading-indicator',
  imports: [ProgressIndicatorComponent, SpinnerComponent],
  templateUrl: './loading-indicator.html',
})
export class LoadingIndicatorComponent {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly loading = inject(LoadingService);
  private readonly languageService = inject(LanguageService);

  readonly variant = input<LoadingIndicatorVariant>('overlay-spinner');
  readonly spinnerVariant = input<SpinnerVariant>('ring-dot');
  readonly blocking = input(true);
  readonly ariaLabel = input<string | null>(null);

  protected readonly isLoading = this.loading.isLoading;
  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.languageService.translate('common.loading'),
  );

  constructor() {
    effect((onCleanup) => {
      if (!this.isLoading()) {
        return;
      }

      const host = this.elementRef.nativeElement;
      const contentContainer = host.parentElement;

      if (!contentContainer) {
        return;
      }

      const shouldBlock = this.variant() === 'overlay-spinner' && this.blocking();
      const managedElements = new Map<Element, ManagedElementState>();

      const updateApplicationContent = (): void => {
        for (const element of contentContainer.children) {
          if (
            element === host ||
            element.matches('ms-loading-indicator, ms-toast-outlet, [data-loading-exempt]')
          ) {
            continue;
          }

          if (!managedElements.has(element)) {
            managedElements.set(element, {
              ariaBusy: element.getAttribute('aria-busy'),
              inert: element.hasAttribute('inert'),
            });
          }

          element.setAttribute('aria-busy', 'true');

          if (shouldBlock) {
            element.setAttribute('inert', '');
          }
        }
      };

      updateApplicationContent();

      const MutationObserver = this.document.defaultView?.MutationObserver;
      const observer = MutationObserver
        ? new MutationObserver(() => updateApplicationContent())
        : undefined;
      observer?.observe(contentContainer, { childList: true });

      if (shouldBlock) {
        lockBody(this.document);
      }

      onCleanup(() => {
        observer?.disconnect();

        for (const [element, state] of managedElements) {
          if (state.ariaBusy === null) {
            element.removeAttribute('aria-busy');
          } else {
            element.setAttribute('aria-busy', state.ariaBusy);
          }

          if (!state.inert) {
            element.removeAttribute('inert');
          }
        }

        if (shouldBlock) {
          unlockBody(this.document);
        }
      });
    });
  }
}
