# Feature 054: Table Clipboard Service

## Goal

Create a reusable service that copies a native HTML table or one native table row to the system
clipboard as readable tab-separated plain text and sanitized HTML table markup. Consumers can
exclude action columns, controls, and other non-data content with a CSS selector; elements marked
with `data-no-copy` are excluded by default.

The service adds clipboard behavior only. It does not render table UI, own table data, or replace
the native table style system.

## Non-Goals

- Do not create an Angular table component or directive.
- Do not add CSV quoting, spreadsheet formulas, data transformation, or file export behavior.
- Do not copy the source table's arbitrary attributes, classes, styles, event handlers, or
  descendant markup into the HTML clipboard representation.
- Do not infer hidden columns from CSS visibility.
- Do not implement copy buttons, toast messages, or other visual feedback in the service.

## Public API

Import the public pieces from the UI library barrel:

```ts
import {
  TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR,
  TableClipboardService,
  type CopyClipboardResult,
  type TableClipboardOptions,
} from './shared/ui-lib';
```

Public pieces:

- `TableClipboardService` for copying a complete native table or one native table row
- `TableClipboardOptions` for configuring excluded elements
- `TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR` with the value `'[data-no-copy]'`
- the existing `CopyClipboardResult = 'copied' | 'failed'` result type from the clipboard copy
  feature

Required service API:

```ts
interface TableClipboardOptions {
  readonly excludeSelector?: string | null;
}

const TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR = '[data-no-copy]';

@Service()
class TableClipboardService {
  copyTable(table: HTMLTableElement, options?: TableClipboardOptions): Promise<CopyClipboardResult>;

  copyRow(row: HTMLTableRowElement, options?: TableClipboardOptions): Promise<CopyClipboardResult>;
}
```

Options:

- `excludeSelector` accepts any valid CSS selector, including a comma-separated selector list.
- When `excludeSelector` is `undefined` or omitted, it defaults to
  `TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR`.
- Passing `excludeSelector: null` disables element exclusion.
- Passing an invalid selector causes the operation to return `failed`; it must not throw to the
  consumer or write partial clipboard content.

Keep `TableClipboardOptions` and `TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR` in a focused sibling
types/config file and re-export them with the service.

## Desired Usage

Copy a complete table while excluding the actions column by default:

```ts
import { Component, ElementRef, inject, viewChild } from '@angular/core';

import { TableClipboardService } from './shared/ui-lib';

@Component({
  selector: 'app-copy-table-example',
  template: `
    <button type="button" class="btn btn-outline" (click)="copyTable()">Copy Table</button>

    <table #invoiceTable class="table">
      <thead>
        <tr>
          <th scope="col">Invoice</th>
          <th scope="col">Amount</th>
          <th scope="col" data-no-copy>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>INV-2048</td>
          <td>$4,200.00</td>
          <td data-no-copy><button type="button">Open</button></td>
        </tr>
      </tbody>
    </table>
  `,
})
export class CopyTableExample {
  private readonly tableClipboard = inject(TableClipboardService);
  private readonly invoiceTable = viewChild.required<ElementRef<HTMLTableElement>>('invoiceTable');

  protected async copyTable(): Promise<void> {
    const result = await this.tableClipboard.copyTable(this.invoiceTable().nativeElement);
    // Present application-owned success or failure feedback from `result`.
  }
}
```

The copied text, shown with its tab separators escaped, is:

```text
Invoice\tAmount
INV-2048\t$4,200.00
```

Copy one row with a custom exclusion selector:

```ts
const result = await tableClipboard.copyRow(rowElement, {
  excludeSelector: '[data-private], .row-actions',
});
```

Copy one row without exclusions:

```ts
const result = await tableClipboard.copyRow(rowElement, {
  excludeSelector: null,
});
```

## Structure

The implementation lives in:

`src/app/shared/ui-lib/services`

The feature includes:

- `table-clipboard.service.ts`
- `table-clipboard-types.ts`
- exports from `src/app/shared/ui-lib/services/index.ts`
- the existing root `src/app/shared/ui-lib/index.ts` service export path

The service is root-provided through `@Service()` and remains stateless. It accepts native DOM
elements directly so consumers can use `viewChild`, event targets narrowed to the correct native
type, or another source of an `HTMLTableElement` or `HTMLTableRowElement`.

Rich table clipboard writing belongs to `TableClipboardService`. Keep the existing
`copyTextToClipboard` helper text-only so copy buttons and other plain-text consumers do not take a
dependency on table-specific HTML behavior.

## Behavior

### Table Extraction

- `copyTable(table)` reads the table's own rows in native `table.rows` order, including header,
  body, and footer rows.
- Only each row's direct native `th` and `td` cells, exposed by `row.cells`, become clipboard
  fields. Nested table rows and cells must not become additional rows or fields.
- Included cells are joined with one tab character (`\t`).
- Included rows are joined with one line-feed character (`\n`).
- The output has no trailing tab or trailing line feed.
- `colspan` and `rowspan` do not duplicate values; each included DOM cell contributes exactly one
  field.
- Rows excluded by the effective selector are omitted.
- Rows with no included cells after exclusion are omitted.
- If no rows with included cells remain, the result is `failed` and no clipboard write is
  attempted.

### Row Extraction

- `copyRow(row)` applies the same cell selection, exclusion, and text normalization rules to the
  supplied row.
- If the supplied row itself matches the effective exclusion selector, the result is `failed` and
  no clipboard write is attempted.
- If the row has no included cells after exclusion, the result is `failed` and no clipboard write
  is attempted.
- A row does not need to be connected to the document or owned by a table.

### Exclusion

- Apply the effective exclusion selector to rows, cells, and descendants within included cells.
- An excluded row contributes no clipboard line.
- An excluded `th` or `td` contributes no clipboard field or separator.
- Excluded descendants inside an included cell contribute no text, while the cell itself remains a
  field.
- Evaluate extraction without mutating, removing, hiding, or replacing nodes in the consumer's
  live DOM. A clone may be used to remove excluded descendants before reading cell text.
- CSS visibility does not imply exclusion. Consumers must mark non-copyable content or provide a
  selector explicitly.

### Text Normalization and Clipboard Result

- Read text content, not HTML markup, from each included cell after excluded descendants are
  removed.
- Convert non-breaking spaces to regular spaces.
- Collapse runs of whitespace, including embedded tabs and line breaks, to one regular space and
  trim leading and trailing whitespace from each cell.
- Preserve empty included cells as empty fields so column positions remain stable.
- Pass the completed plain-text and HTML values to the service's table-specific clipboard writer.
- Write `text/plain` and `text/html` in one `ClipboardItem` when rich clipboard writing is
  available. The plain-text representation remains tab-separated, while the HTML representation
  uses native `table`, table-section, `tr`, `th`, and `td` elements.
- Build HTML from extracted cell data. Escape cell text and preserve only structural `colspan`,
  `rowspan`, and header `scope` attributes; do not copy arbitrary source HTML or attributes.
- Wrap `copyRow` HTML in `<table><tbody>...</tbody></table>` so the row remains valid pasteable
  table markup.
- Fall back to `navigator.clipboard.writeText` when `ClipboardItem`, rich clipboard writing, or the
  rich write attempt is unavailable or rejected.
- Return `copied` after either the rich write or its plain-text fallback succeeds.
- Return `failed` for invalid selectors, empty extracted output, unavailable clipboard access, or a
  rejected clipboard write.
- Do not throw clipboard or extraction failures to consumers.
- Each call is independent; the service stores no last-copied element, text, result, or timer.

## Composition Rules

- Consumers own the native table markup and decide where copy actions appear.
- Add `data-no-copy` to an entire row or cell to omit it, or to a descendant such as a button,
  link, badge, or visually hidden helper to omit only that descendant's text.
- A custom `excludeSelector` replaces the default selector for that call. Consumers that need both
  the default marker and custom markers must include both, for example
  `'[data-no-copy], [data-private]'`.
- The service does not inspect Angular components, directives, data sources, or table styling
  classes.
- Visual success and failure feedback belongs to the consuming component. Consumers should use the
  returned `CopyClipboardResult` to present that feedback.

## Accessibility

The service renders no UI and does not change native table semantics.

- Consumer-owned copy controls use native buttons with clear accessible names such as
  `Copy Table` or `Copy Invoice Row`.
- Consumers announce `copied` and `failed` outcomes when the result is not otherwise apparent.
- `data-no-copy` affects clipboard extraction only; it must not hide content from assistive
  technology or remove content from the accessibility tree.
- Copying must not move focus, change selection, or mutate the table DOM.

## Showcase

Update the existing `/tables` showcase with:

- a complete-table copy example using the default `[data-no-copy]` marker on an actions column
- a row-level copy action that passes the matching `HTMLTableRowElement` to `copyRow`
- visible success and failure feedback driven by the returned `CopyClipboardResult`
- a custom exclusion selector example

Keep the copy controls outside the copied data unless they are intentionally placed in cells marked
with `data-no-copy`.

Use `ShowcaseCode` from `src/app/shared/showcase-code`. Keep snippets hand-authored in the feature
component `.ts` file, import `TableClipboardService` through `./shared/ui-lib`, and make every
snippet a full standalone Angular component example. Render each snippet near its matching live
example with `<app-showcase-code>` and keep both behaviors in sync.

No new route, home showcase card, or feature styling is required.

## Angular Rules

- Use `@Service()` for the root-provided service.
- Use `inject()` and signal queries in showcase examples.
- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection`
  metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Keep strict TypeScript and use native `HTMLTableElement` and `HTMLTableRowElement` types.
- Avoid `any` and unsafe element casts.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `TableClipboardService`, `TableClipboardOptions`, and
  `TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR` are exported through the services and root UI library
  barrels.
- `copyTable` accepts an `HTMLTableElement`; `copyRow` accepts an `HTMLTableRowElement`; both return
  `Promise<CopyClipboardResult>`.
- The default selector is `[data-no-copy]`, a custom selector replaces it, and `null` disables
  exclusion.
- Whole-table output uses tabs between included cells and line feeds between included rows in DOM
  order, without trailing delimiters.
- Excluded rows and cells are omitted, and excluded cell descendants do not contribute text.
- Extraction never mutates the supplied table or row.
- Whitespace is normalized consistently while empty included cells preserve column positions.
- Nested tables do not add rows or fields to the copied result.
- Empty extraction, invalid selectors, unavailable clipboard access, and rejected writes return
  `failed` without throwing.
- Clipboard writes include `text/plain` and `text/html` where supported and fall back to
  `writeText` when necessary.
- Generated HTML contains only safe table structure, normalized escaped cell text, spans, and
  header scope metadata.
- Rich clipboard writing remains internal to `TableClipboardService`; `copyTextToClipboard` remains
  a separate text-only helper.
- The `/tables` showcase demonstrates complete-table and single-row copying with matching copyable
  snippets and accessible result feedback.
- No Angular table component, directive, route, home card, feature SCSS, or tests are added.
