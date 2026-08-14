import {
  afterNextRender,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import { CopyButtonComponent } from '../copy-button';
import { ModalComponent } from '../modal';
import { SignalFormField } from '../signal-form-field';
import { FormatJsonPipe, HighlightPipe, type HighlightPart } from '../../pipes';

type ValueViewerSearchForm = {
  searchText: string;
};

type ValueViewerPart = HighlightPart & {
  readonly matchIndex: number | null;
};

let nextValueViewerId = 0;

@Component({
  selector: 'ms-value-viewer',
  imports: [CopyButtonComponent, FormField, ModalComponent, SignalFormField],
  providers: [FormatJsonPipe, HighlightPipe],
  templateUrl: './value-viewer.html',
})
export class ValueViewerComponent {
  private readonly formatJson = inject(FormatJsonPipe);
  private readonly highlight = inject(HighlightPipe);
  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  private readonly matchElements = viewChildren<ElementRef<HTMLElement>>('matchElement');
  private readonly searchModel = signal<ValueViewerSearchForm>({ searchText: '' });

  readonly value = input.required<unknown>();
  readonly title = input('Value Viewer');
  readonly close = output<void>();

  protected readonly searchInputId = `value-viewer-search-${nextValueViewerId++}`;
  protected readonly searchForm = form(
    this.searchModel,
    schema<ValueViewerSearchForm>(() => {}),
  );
  protected readonly searchField = this.searchForm.searchText;

  protected readonly displayText = computed(() => this.resolveDisplayText(this.value()));
  protected readonly clipboardText = computed(() =>
    this.resolveClipboardText(this.value(), this.displayText()),
  );
  protected readonly searchText = computed(() => this.searchField().controlValue().trim());
  protected readonly highlightedParts = computed<readonly ValueViewerPart[]>(() => {
    let matchIndex = 0;

    return this.highlight.transform(this.displayText(), this.searchText()).map((part) => ({
      ...part,
      matchIndex: part.match ? matchIndex++ : null,
    }));
  });
  protected readonly matchCount = computed(
    () => this.highlightedParts().filter((part) => part.match).length,
  );
  protected readonly activeMatchIndex = linkedSignal({
    source: () => ({
      displayText: this.displayText(),
      searchText: this.searchText(),
      matchCount: this.matchCount(),
    }),
    computation: ({ matchCount }): number => (matchCount > 0 ? 0 : -1),
  });
  protected readonly matchStatus = computed(() => {
    const count = this.matchCount();

    if (count === 0) {
      return 'No matches';
    }

    return `${this.activeMatchIndex() + 1} of ${count}`;
  });
  protected readonly navigationDisabled = computed(() => this.matchCount() < 2);

  private readonly scrollActiveMatch = effect(() => {
    this.activeMatchIndex();
    this.matchElements();

    queueMicrotask(() => {
      const activeIndex = this.activeMatchIndex();

      if (activeIndex < 0) {
        return;
      }

      this.matchElements()[activeIndex]?.nativeElement.scrollIntoView({
        block: 'center',
        inline: 'nearest',
      });
    });
  });

  constructor() {
    afterNextRender(() => this.searchInput().nativeElement.focus());
  }

  protected previousMatch(): void {
    this.moveMatch(-1);
  }

  protected nextMatch(): void {
    this.moveMatch(1);
  }

  protected handleSearchEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;

    if (this.matchCount() === 0) {
      return;
    }

    keyboardEvent.preventDefault();
    this.moveMatch(keyboardEvent.shiftKey ? -1 : 1);
  }

  private moveMatch(direction: -1 | 1): void {
    const count = this.matchCount();

    if (count < 2) {
      return;
    }

    this.activeMatchIndex.update((current) => (current + direction + count) % count);
  }

  private resolveDisplayText(value: unknown): string {
    const formatted = this.formatJson.transform(value);

    if (typeof formatted === 'string') {
      return formatted;
    }

    return this.safeString(formatted);
  }

  private resolveClipboardText(value: unknown, displayText: string): string {
    if (typeof value === 'string') {
      try {
        return JSON.stringify(JSON.parse(value)) ?? displayText;
      } catch {
        return value;
      }
    }

    try {
      return JSON.stringify(value) ?? displayText;
    } catch {
      return displayText;
    }
  }

  private safeString(value: unknown): string {
    try {
      return String(value);
    } catch {
      return '';
    }
  }
}
