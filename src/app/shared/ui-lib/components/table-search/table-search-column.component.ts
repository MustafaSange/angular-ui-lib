import { Component, computed, effect, inject, input } from '@angular/core';

import { SEARCH_SORT_DIRECTION } from '../../search-query';
import { TableFilterPopoverComponent } from './table-search-filter-popover';
import { TableSearchDirective } from './table-search.directive';
import { TableSortPopoverComponent } from './table-search-sort-popover';

@Component({
  selector: 'th[msTableSearchColumn]',
  imports: [TableFilterPopoverComponent, TableSortPopoverComponent],
  templateUrl: './table-search-column.component.html',
  host: {
    class: 'table-search-column',
    '[attr.aria-sort]': 'ariaSort()',
  },
})
export class TableSearchColumnComponent {
  readonly propertyName = input.required<string>({ alias: 'msTableSearchColumn' });

  protected readonly table = inject(TableSearchDirective);
  protected readonly property = computed(() => this.table.getProperty(this.propertyName()));
  protected readonly ariaSort = computed<'ascending' | 'descending' | null>(() => {
    const primary = this.table.state().sort?.[0];
    if (!primary || primary.property !== this.propertyName()) {
      return null;
    }
    return primary.direction === SEARCH_SORT_DIRECTION.DESCENDING ? 'descending' : 'ascending';
  });

  constructor() {
    effect((onCleanup) => onCleanup(this.table.registerColumn(this.propertyName())));
  }
}
