import {
  AfterContentInit,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { OverflowNavigation, OverflowNavigationButton } from '../../directives';

@Component({
  selector: 'ms-readonly-value',
  imports: [OverflowNavigation, OverflowNavigationButton],
  template: `
    @let overflow = navigation.state();

    @if (overflow.hasOverflow && overflow.canScrollBackward) {
      <button
        msOverflowNavigationButton="backward"
        aria-label="Scroll value backward"
        (click)="navigation.scroll('backward')"
      ></button>
    }

    <span
      #valueContent
      #navigation="overflowNavigation"
      class="readonly-value-content"
      [msOverflowNavigation]="overflowNavigation()"
      [msOverflowScrollRatio]="overflowScrollRatio()"
    >
      <ng-content />
      @if (!hasProjectedContent()) {
        <span class="readonly-value-fallback">{{ displayValue() }}</span>
      }
    </span>

    @if (overflow.hasOverflow && overflow.canScrollForward) {
      <button
        msOverflowNavigationButton="forward"
        aria-label="Scroll value forward"
        (click)="navigation.scroll('forward')"
      ></button>
    }
  `,
  host: {
    class: 'form-field-readonly-value',
    '[class.is-placeholder]': 'isPlaceholder()',
    '[class.is-readonly]': 'readonly()',
    '[class.is-disabled]': 'disabled()',
    '[class.has-overflow-navigation]': 'overflowNavigation()',
    '[attr.aria-readonly]': "readonly() ? 'true' : null",
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
  },
})
export class SignalReadonlyValue implements AfterContentInit {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input<unknown>(null);
  readonly placeholder = input('');
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly overflowNavigation = input(false, { transform: booleanAttribute });
  readonly overflowScrollRatio = input(0.75);

  protected readonly hasProjectedContent = signal(false);

  protected readonly displayValue = computed(() => {
    const value = this.value();

    if (value === null || value === undefined || value === '') {
      return this.placeholder();
    }

    return String(value);
  });

  protected readonly isPlaceholder = computed(() => {
    const value = this.value();

    return !this.hasProjectedContent() && (value === null || value === undefined || value === '');
  });

  ngAfterContentInit(): void {
    const content = this.elementRef.nativeElement.querySelector('.readonly-value-content');
    const fallback = content?.querySelector(':scope > .readonly-value-fallback');
    const hasContent = Array.from(content?.childNodes ?? []).some(
      (node) => node !== fallback && node.nodeType !== 8 && Boolean(node.textContent?.trim()),
    );

    this.hasProjectedContent.set(hasContent);
  }
}
