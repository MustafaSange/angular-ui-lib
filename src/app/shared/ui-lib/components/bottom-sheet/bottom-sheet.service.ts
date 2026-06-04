import { DOCUMENT } from '@angular/common';
import { Injectable, Injector, Type, inject, signal } from '@angular/core';

import type { BottomSheetConfig, BottomSheetOpenOptions } from './bottom-sheet-config';
import { BottomSheetRef } from './bottom-sheet-ref';
import { BOTTOM_SHEET_CONFIG, BOTTOM_SHEET_DATA, BOTTOM_SHEET_REF } from './bottom-sheet-tokens';

export type BottomSheetEntry = {
  id: number;
  component: Type<unknown>;
  injector: Injector;
  sheetRef: BottomSheetRef<unknown>;
  stackOffset: string;
  previouslyFocusedElement: HTMLElement | null;
};

let nextBottomSheetEntryId = 0;

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly sheetEntries = signal<BottomSheetEntry[]>([]);

  readonly entries = this.sheetEntries.asReadonly();

  open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    options: BottomSheetOpenOptions<TData> = {},
  ): BottomSheetRef<TResult> {
    const sheetRef = new BottomSheetRef<TResult>();
    const previouslyFocusedElement = this.document.activeElement;
    const sheetConfig = this.getSheetConfig(options);
    const contentInjector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: BOTTOM_SHEET_DATA,
          useValue: options.data,
        },
        {
          provide: BOTTOM_SHEET_CONFIG,
          useValue: sheetConfig,
        },
        {
          provide: BOTTOM_SHEET_REF,
          useValue: sheetRef,
        },
      ],
    });
    const entry: BottomSheetEntry = {
      id: nextBottomSheetEntryId++,
      component,
      injector: contentInjector,
      sheetRef: sheetRef as BottomSheetRef<unknown>,
      stackOffset: '0',
      previouslyFocusedElement:
        previouslyFocusedElement instanceof HTMLElement ? previouslyFocusedElement : null,
    };

    sheetRef.setCloseHandler((result) => this.close(entry, result));
    this.sheetEntries.update((entries) => this.withStacking([...entries, entry]));

    return sheetRef;
  }

  private close<TResult>(entry: BottomSheetEntry, result: TResult | undefined): void {
    const entries = this.sheetEntries();
    const entryIndex = entries.indexOf(entry);

    if (entryIndex === -1) {
      return;
    }

    this.sheetEntries.set(this.withStacking(entries.filter((item) => item !== entry)));
    entry.sheetRef.finishClose(result);
    entry.previouslyFocusedElement?.focus();
  }

  private getSheetConfig(options: BottomSheetOpenOptions<unknown>): BottomSheetConfig {
    const { closeOnEscape, closeOnBackdrop, showCloseButton, showHandle, size, maxWidth } = options;

    return {
      closeOnEscape,
      closeOnBackdrop,
      showCloseButton,
      showHandle,
      size,
      maxWidth,
    };
  }

  private withStacking(entries: BottomSheetEntry[]): BottomSheetEntry[] {
    return entries.map((entry, index) => {
      entry.stackOffset = `${index * 2}`;

      return entry;
    });
  }
}
