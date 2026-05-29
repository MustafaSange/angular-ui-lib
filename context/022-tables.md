# Feature 022: Native Table Style System

## Goal

Create a CSS-first table style system for native `<table>` markup. The feature should make
structured data readable, responsive, and RTL-safe without adding Angular table behavior or
data-management APIs.

## Non-Goals

- Do not create an Angular table component or directive.
- Do not implement sorting, filtering, pagination, selection, virtualization, or column resizing.
- Do not manage table data, loading state, or empty state in TypeScript.

## Public API

Consumers use native table markup and public CSS classes:

```html
<div class="table-wrapper">
  <table class="table">
    <caption>
      Recent invoices
    </caption>
    <thead>
      <tr>
        <th scope="col" class="text-start">Invoice</th>
        <th scope="col" class="text-end">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-start">INV-2048</td>
        <td class="text-end">$4,200.00</td>
      </tr>
    </tbody>
  </table>
</div>
```

Public classes:

- `.table-wrapper` provides responsive horizontal overflow and the outer table frame.
- `.table` applies base styling to native table elements.
- `.table-compact` reduces cell padding for denser data.
- `.table-striped` adds alternating row backgrounds.
- `.table-hover` adds a row hover treatment.
- `.table-empty` styles an empty-state table cell.
- `.table-loading` styles a loading-state table cell.
- Use existing `.text-start` and `.text-end` utilities to align text, numeric, or action columns
  to the matching logical side.

## Behavior

- Tables use native semantics: `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and
  `<td>`.
- Wide tables scroll inside `.table-wrapper`; the page layout should not overflow horizontally.
- Default density is comfortable. Compact density is opt-in through `.table-compact`.
- Alignment uses logical `text-align: start` and `text-align: end`, so text and numeric cells
  mirror in RTL.
- Empty and loading states are represented by regular table rows with a spanning cell.
- Sorting is consumer-owned and not represented by this v1 API.

## Styling

Feature styles live in `src/styles/components/_tables.scss` and are forwarded from
`src/styles/components/_index.scss`.

- Use existing color, surface, border, spacing, radius, typography, and motion tokens.
- Use logical block/inline properties and logical text alignment.
- Keep selectors scoped to the public table classes and native table descendants.
- Keep the system reusable across future projects.

## Accessibility

- Preserve native table semantics and header associations.
- Use `<caption>` when the table needs an accessible title.
- Use `scope="col"` or `scope="row"` on headers.
- Empty and loading rows remain readable table content and should use appropriate `colspan` values.
- Do not rely on color alone to communicate data meaning.

## Showcase

Add a dedicated `/tables` page and home card demonstrating:

- basic table
- compact density
- striped and hover rows
- numeric/logical-end alignment
- empty state
- loading state
- RTL table

Each visual example renders a matching hand-authored, full standalone Angular example through
`ShowcaseCode`.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Use `ChangeDetectionStrategy.OnPush`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- Table styles are forwarded from the component styles index.
- The `/tables` route and home card are available.
- Showcase examples render matching copyable snippets.
- Tables use only native table elements for table structure.
- `.table-wrapper` handles wide table overflow.
- `.table-compact`, `.table-striped`, `.table-hover`, `.table-empty`, and `.table-loading` behave
  as documented.
- Showcase examples use existing `.text-start` and `.text-end` logical alignment utilities.
- RTL examples align logical-end cells correctly.
- No Angular table component, directive, sorting behavior, or tests are added.
