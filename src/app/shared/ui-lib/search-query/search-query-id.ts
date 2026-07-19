let nextSearchFilterId = 0;

export function createSearchFilterId(
  existingIds: ReadonlySet<string> = new Set(),
  prefix = 'search-filter',
): string {
  let id: string;

  do {
    id = `${prefix}-${nextSearchFilterId++}`;
  } while (existingIds.has(id));

  return id;
}
