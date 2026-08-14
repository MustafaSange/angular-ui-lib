# Feature 052: Highlight Pipe

## Goal

Provide a reusable Angular pipe that divides text into matching and non-matching parts for safe,
case-insensitive highlighting. Consumers retain control of the rendered markup, and all source text
continues to be escaped by Angular interpolation rather than being converted to trusted HTML.

## Public API

Import the pipe and its result type from the public UI library barrel:

```ts
import { HighlightPart, HighlightPipe } from './shared/ui-lib';
```

Public pieces:

- `HighlightPipe` with pipe name `highlight`
- `HighlightPart` with `text: string` and `match: boolean`
- `transform(value, searchText)` accepts `string | null | undefined` for both arguments and returns
  `HighlightPart[]`

The pipe treats the complete trimmed search text as one literal substring. Matching is
case-insensitive and non-overlapping, while each returned part preserves the source text's original
content and casing.

## Desired Usage

Render matching parts with the semantic `mark` element and non-matching parts as ordinary text:

```ts
import { Component, signal } from '@angular/core';

import { HighlightPipe } from './shared/ui-lib';

@Component({
  selector: 'app-highlight-example',
  imports: [HighlightPipe],
  template: `
    <label for="highlight-search">Search Text</label>
    <input
      #searchInput
      id="highlight-search"
      type="search"
      [value]="searchText()"
      (input)="searchText.set(searchInput.value)"
    />

    <p>
      @for (part of description | highlight: searchText(); track $index) {
        @if (part.match) {
          <mark>{{ part.text }}</mark>
        } @else {
          <span>{{ part.text }}</span>
        }
      }
    </p>
  `,
})
export class HighlightExample {
  readonly description = 'Angular makes enterprise applications approachable.';
  readonly searchText = signal('angular');
}
```

Do not replace the part-based template with an `innerHTML` binding. The pipe deliberately returns
structured data so consumers can choose semantic markup without trusting generated HTML.

## Structure

The implementation lives in:

- `src/app/shared/ui-lib/pipes/highlight.pipe.ts`
- `src/app/shared/ui-lib/pipes/highlight.types.ts`

The public exports live in:

- `src/app/shared/ui-lib/pipes/index.ts`
- `src/app/shared/ui-lib/index.ts`

`highlight.types.ts` owns the reusable public `HighlightPart` interface. No component, directive,
service, template, or UI-library stylesheet is required.

## Behavior

- Return `[]` when `value` is `''`, `null`, or `undefined`.
- Trim `searchText` before matching.
- When `searchText` is `null`, `undefined`, empty, or whitespace-only, return one non-matching part
  containing the complete source value.
- Escape every regular-expression metacharacter in the trimmed search text so values such as `.`,
  `+`, `?`, `(`, `)`, `[`, `]`, `{`, `}`, `^`, `$`, `|`, `*`, and `\\` are matched literally.
- Create one global, case-insensitive regular expression from the escaped search text.
- Traverse matches once with `RegExp.exec`. For each match, append a non-matching source slice when
  text exists between the cursor and the match, then append the matching source slice and advance
  the cursor to the end of that match.
- Append a final non-matching slice when text remains after the last match.
- When there are no matches, return one non-matching part containing the complete source value.
- Omit zero-length parts from the result.
- Preserve all original whitespace, punctuation, Unicode content, and letter casing in returned
  parts.
- Return matches in source order and do not produce overlapping matches.
- Do not mutate either input.
- Keep the pipe pure. Angular recalculates it when either primitive input value changes.
- Do not add tokenization, fuzzy matching, accent normalization, locale-specific matching, or HTML
  parsing.

This single traversal avoids the second regular expression and the intermediate arrays created by
the original `split`, `filter`, and `map` pipeline.

## Safe Rendering

- Return plain strings and match metadata only. Do not return HTML, `SafeHtml`, or sanitized markup.
- Render every `HighlightPart.text` value with Angular interpolation, using `mark` for matches and
  an inline `span` for non-matches so template formatting cannot insert spaces between parts.
- Do not use `[innerHTML]`, `DomSanitizer`, `sanitize`, or `bypassSecurityTrustHtml` in the pipe,
  showcase, or documented usage.
- Rely on Angular interpolation to escape user-controlled text. HTML-like input such as
  `<script>alert('example')</script>` must remain visible inert text and must never become an
  element, attribute, or executable script.
- Escaping the search text for regular-expression construction protects matching behavior; it is
  separate from HTML escaping and does not make a value safe for `innerHTML`.

## Styling and Accessibility

- The pipe owns no styles. Consumers choose how matching `mark` elements look.
- Showcase-only highlight styles live in `src/app/features/highlight/highlight.scss` and use existing
  color, spacing, radius, and typography tokens.
- Use the native `mark` element for matched text and ordinary interpolated text for non-matches.
- Do not hide either kind of part from assistive technology; reading the result must preserve the
  complete source sentence in its original order.
- Associate the interactive showcase search control with a visible label and preserve native
  keyboard and focus behavior.
- Highlighting must not introduce focusable elements or additional keyboard interactions.

## Showcase

The showcase lives at `/highlight` and is linked from the home showcase grid under Pipes.

It demonstrates:

- interactive search text stored in a signal
- multiple matches with different source casing
- matches at the beginning, middle, and end of a value
- repeated and adjacent non-overlapping matches
- regular-expression metacharacters treated as literal text
- unmatched, empty, whitespace-only, and nullish values
- HTML-like source and search text rendered as inert text through interpolation

Each example renders a matching, hand-authored, copyable standalone Angular component with
`ShowcaseCode` imported by the live showcase from `src/app/shared/showcase-code`. Copyable snippets
import `HighlightPipe` and, when explicitly typing results, `HighlightPart` from the public
`./shared/ui-lib` barrel. Render each snippet beside its matching visual example with
`<app-showcase-code>`.

## Angular Rules

- Use a standalone Angular pipe and do not add `standalone: true`.
- Use native `@for` and `@if` template control flow in examples.
- Use a signal for interactive showcase search state.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `HighlightPipe` and `HighlightPart` are available from the public
  `src/app/shared/ui-lib` barrel.
- Empty source values return an empty array, and blank searches return the source as one
  non-matching part.
- Literal, case-insensitive matches are returned in source order without overlaps or empty parts.
- Beginning, middle, end, repeated, adjacent, unmatched, special-character, and preserved-casing
  scenarios behave as documented.
- HTML-like input remains escaped inert text, and no highlight implementation or example uses
  `innerHTML`, `DomSanitizer`, or a trust-bypass API.
- The documented standalone example compiles against the public API.
- The `/highlight` showcase demonstrates the required behavior and safe-rendering cases with
  matching copyable snippets.
- No UI-library stylesheet is added for the data-only pipe.
- The Angular build succeeds.
