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

@Component({
  selector: 'ms-readonly-value',
  template: `
    <ng-content />
    @if (!hasProjectedContent()) {
      <span class="readonly-value-fallback">{{ displayValue() }}</span>
    }
  `,
  host: {
    class: 'form-field-readonly-value',
    '[class.is-placeholder]': 'isPlaceholder()',
    '[class.is-readonly]': 'readonly()',
    '[class.is-disabled]': 'disabled()',
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
    const host = this.elementRef.nativeElement;
    const fallback = host.querySelector(':scope > .readonly-value-fallback');
    const hasContent = Array.from(host.childNodes).some(
      (node) => node !== fallback && node.nodeType !== 8 && Boolean(node.textContent?.trim()),
    );

    this.hasProjectedContent.set(hasContent);
  }
}
