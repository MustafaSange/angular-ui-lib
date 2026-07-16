import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormField, applyEach, form, required, schema, submit } from '@angular/forms/signals';

import { PopoverComponent, PopoverPanelComponent, PopoverTrigger } from '../menu-popover';
import { SignalFormField } from '../signal-form-field';
import {
  SEARCH_SORT_DIRECTION,
  normalizeSearchSortDirection,
  type SearchPropertyConfig,
  type SearchSortRequest,
} from '../../search-query';
import { TableSearchDirective } from './table-search.directive';

interface SortDraftRow {
  readonly id: string;
  readonly property: string;
  readonly direction: string;
}

interface SortDraftModel {
  readonly sorts: readonly SortDraftRow[];
}

let nextSortRowId = 0;
let nextSortPopoverId = 0;

@Component({
  selector: 'ms-table-sort-popover',
  imports: [FormField, PopoverComponent, PopoverPanelComponent, PopoverTrigger, SignalFormField],
  templateUrl: './table-search-sort-popover.html',
})
export class TableSortPopoverComponent {
  readonly property = input.required<SearchPropertyConfig>();

  protected readonly table = inject(TableSearchDirective);
  protected readonly SEARCH_SORT_DIRECTION = SEARCH_SORT_DIRECTION;
  protected readonly descriptionId = `table-sort-description-${nextSortPopoverId++}`;
  protected readonly open = signal(false);
  protected readonly model = signal<SortDraftModel>({ sorts: [] });
  protected readonly liveMessage = signal('');
  protected readonly sorts = computed(() => this.model().sorts);
  protected readonly activeSorts = computed(() => this.table.state().sort ?? []);
  protected readonly activeSort = computed(() => {
    const index = this.activeSorts().findIndex(
      (sort) => sort.property === this.property().propertyName,
    );
    return index < 0 ? null : { index, sort: this.activeSorts()[index] };
  });
  protected readonly active = computed(() => this.activeSort() !== null);
  protected readonly triggerIcon = computed(() => {
    const activeSort = this.activeSort();
    if (!activeSort) {
      return 'unfold_more';
    }
    return activeSort.sort.direction === SEARCH_SORT_DIRECTION.DESCENDING
      ? 'arrow_downward'
      : 'arrow_upward';
  });
  protected readonly canAdd = computed(
    () =>
      this.sorts().length < this.table.sortLimit() &&
      this.sorts().length < this.table.sortOptions().length,
  );
  protected readonly description = computed(() => {
    const sorts = this.activeSorts();
    if (sorts.length === 0) {
      return 'No table sorting is active.';
    }
    return sorts
      .map(
        (sort, index) =>
          `${this.sortLabel(sort.property)} priority ${index + 1}, ${
            sort.direction === SEARCH_SORT_DIRECTION.DESCENDING ? 'descending' : 'ascending'
          }`,
      )
      .join('. ');
  });

  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly firstControl = viewChild<ElementRef<HTMLElement>>('firstControl');
  private readonly openedSortSignature = signal('');
  private draggedIndex: number | null = null;

  protected readonly sortForm = form(
    this.model,
    schema<SortDraftModel>((path) => {
      applyEach(
        path.sorts,
        schema<SortDraftRow>((row) => {
          required(row.property, { message: 'Choose a sort property.' });
          required(row.direction, { message: 'Choose a sort direction.' });
        }),
      );
    }),
  );

  constructor() {
    effect(() => {
      if (this.table.disabled() && this.open()) {
        this.open.set(false);
      }
    });
    effect(() => {
      const signature = JSON.stringify(this.activeSorts());
      if (this.open() && this.openedSortSignature() && signature !== this.openedSortSignature()) {
        this.open.set(false);
      }
    });
  }

  protected handleOpenChange(open: boolean): void {
    this.open.set(open);
    if (open) {
      this.model.set({
        sorts: this.activeSorts().map((sort) => this.toDraft(sort)),
      });
      this.openedSortSignature.set(JSON.stringify(this.activeSorts()));
      this.liveMessage.set('');
      queueMicrotask(() => this.firstControl()?.nativeElement.focus());
    } else {
      this.openedSortSignature.set('');
    }
  }

  protected add(): void {
    if (!this.canAdd()) {
      return;
    }
    const used = new Set(this.sorts().map((sort) => sort.property));
    const option = this.table.sortOptions().find((item) => !used.has(item.value));
    if (!option) {
      return;
    }
    this.model.update((model) => ({
      sorts: [
        ...model.sorts,
        {
          id: `table-sort-row-${nextSortRowId++}`,
          property: option.value,
          direction: String(SEARCH_SORT_DIRECTION.ASCENDING),
        },
      ],
    }));
  }

  protected remove(index: number): void {
    this.model.update((model) => ({
      sorts: model.sorts.filter((_, rowIndex) => rowIndex !== index),
    }));
  }

  protected clear(): void {
    this.model.set({ sorts: [] });
    this.liveMessage.set('Sort draft cleared. Apply to commit no sorting.');
  }

  protected cancel(): void {
    this.closeAndFocus();
  }

  protected async apply(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.sortForm, async () => {
      if (this.hasDuplicates()) {
        this.liveMessage.set('Each sort property can be selected only once.');
        return undefined;
      }
      const sorts = this.sorts().map(
        (sort): SearchSortRequest => ({
          property: sort.property,
          direction: normalizeSearchSortDirection(Number(sort.direction)),
        }),
      );
      if (this.table.commitSort(sorts)) {
        this.closeAndFocus();
      }
      return undefined;
    });
  }

  protected optionDisabled(property: string, rowIndex: number): boolean {
    return this.sorts().some((sort, index) => index !== rowIndex && sort.property === property);
  }

  protected field(index: number) {
    return this.sortForm.sorts[index];
  }

  protected sortLabel(property: string): string {
    return this.table.sortOptions().find((option) => option.value === property)?.label ?? property;
  }

  protected hasDuplicates(): boolean {
    return new Set(this.sorts().map((sort) => sort.property)).size !== this.sorts().length;
  }

  protected startDrag(index: number, event: DragEvent): void {
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  protected allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  protected drop(index: number, event: DragEvent): void {
    event.preventDefault();
    const from = this.draggedIndex;
    this.draggedIndex = null;
    if (from !== null) {
      this.move(from, index);
    }
  }

  protected handleReorderKey(index: number, event: KeyboardEvent): void {
    if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) {
      return;
    }
    event.preventDefault();
    this.move(index, event.key === 'ArrowUp' ? index - 1 : index + 1);
  }

  private move(from: number, to: number): void {
    if (to < 0 || to >= this.sorts().length || from === to) {
      return;
    }
    const rows = [...this.sorts()];
    const [row] = rows.splice(from, 1);
    rows.splice(to, 0, row);
    this.model.set({ sorts: rows });
    this.liveMessage.set(`${this.sortLabel(row.property)} moved to position ${to + 1}.`);
  }

  private closeAndFocus(): void {
    this.open.set(false);
    queueMicrotask(() => this.trigger()?.nativeElement.focus());
  }

  private toDraft(sort: SearchSortRequest): SortDraftRow {
    return {
      id: `table-sort-row-${nextSortRowId++}`,
      property: sort.property,
      direction: String(sort.direction),
    };
  }
}
