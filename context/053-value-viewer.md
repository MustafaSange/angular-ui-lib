# Feature 053: Value Viewer

## Goal

Provide a reusable modal value viewer that converts an unknown input into readable text, copies a
compact representation, and supports safe literal search with wrapped Previous and Next navigation.
The viewer composes the existing modal, clipboard copy, signal form field, format JSON, and highlight
features instead of duplicating their behavior.

## Public API

Import public pieces from the UI library barrel:

```ts
import {
  ValueViewerComponent,
  ValueViewerService,
  type ValueViewerOpenOptions,
} from './shared/ui-lib';
```

Public pieces:

- `ValueViewerComponent` with selector `ms-value-viewer`
- `ValueViewerService` for service-opened viewers
- `ValueViewerOpenOptions` for the title and existing modal shell overrides

Required component API:

```ts
class ValueViewerComponent {
  readonly value = input.required<unknown>();
  readonly title = input('Value Viewer');
  readonly close = output<void>();
}
```

Required service API:

```ts
class ValueViewerService {
  open(value: unknown, options?: ValueViewerOpenOptions): ModalRef<void>;
}
```

Required options type:

```ts
type ValueViewerOpenOptions = ModalConfig & {
  title?: string;
};
```

Defaults for service-opened viewers:

- `title` is `Value Viewer`
- `width` is not overridden and follows the existing modal stylesheet default
- `maxWidth` and `maxHeight` are not overridden and follow the existing modal defaults
- backdrop close, Escape close, and the close button follow the existing modal defaults unless the
  caller overrides them

The service returns the existing `ModalRef<void>` so callers can observe closure. Closing the viewer
does not produce a business result.

## Desired Usage

Mount the existing modal outlet once near the application root:

```html
<router-outlet /> <ms-modal-outlet />
```

Open a value through the service:

```ts
import { Component, inject } from '@angular/core';

import { ValueViewerService } from './shared/ui-lib';

@Component({
  selector: 'app-api-response-example',
  template: `
    <button class="btn btn-primary" type="button" (click)="openResponse()">
      View API Response
    </button>
  `,
})
export class ApiResponseExample {
  private readonly valueViewer = inject(ValueViewerService);

  protected openResponse(): void {
    this.valueViewer.open(
      {
        project: 'UI library',
        version: 22,
        features: ['modal', 'copy', 'search'],
      },
      {
        title: 'API Response',
        width: '56rem',
      },
    );
  }
}
```

Use the component declaratively when the consumer owns visibility state:

```ts
import { Component, signal } from '@angular/core';

import { ValueViewerComponent } from './shared/ui-lib';

@Component({
  selector: 'app-declarative-value-viewer-example',
  imports: [ValueViewerComponent],
  template: `
    <button class="btn btn-primary" type="button" (click)="open.set(true)">View Log</button>

    @if (open()) {
      <ms-value-viewer title="Request Log" [value]="log" (close)="open.set(false)" />
    }
  `,
})
export class DeclarativeValueViewerExample {
  readonly open = signal(false);
  readonly log = 'Started request\nCompleted request';
}
```

Service usage is preferred when consumers need modal stacking, focus trapping, Escape handling,
body scroll locking, and focus restoration coordinated by `ModalService`.

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/value-viewer`

The feature includes:

- public `ValueViewerComponent`
- public `ValueViewerService`
- public `ValueViewerOpenOptions`
- an internal service-opened wrapper and injected data type
- internal value-normalization helpers and highlighted-part metadata
- `index.ts`

`ValueViewerService` opens the internal wrapper through `ModalService`. The wrapper reads its value
and title from `MODAL_DATA`, binds them to `ValueViewerComponent`, and closes its `ModalRef<void>`
when the component emits `close`. This preserves a required `[value]` input for declarative usage
without changing `ModalService` or adding dynamic component-input support to it.

`ValueViewerComponent` renders one `ms-modal`. The modal body contains the normalized value. A
single wrapper projected to `slot="headerActions"` owns the search control, match status, Previous
and Next actions, and copy button.

No additional outlet, overlay, backdrop, focus trap, or clipboard implementation is added.

## Value Normalization and Copying

Derive display text and clipboard text separately from the input value.

Display text behavior:

- Pass the input through the existing `FormatJsonPipe` behavior.
- Preserve ordinary strings unchanged.
- Parse and pretty-print valid JSON strings with two-space indentation.
- Pretty-print serializable objects, arrays, numbers, booleans, and `null` with two-space
  indentation.
- When JSON formatting returns the original unsupported value or throws, use `String(value)`.
- If both JSON formatting and string conversion fail, return `''` without throwing.

Clipboard text behavior:

- Copy ordinary non-JSON strings exactly as provided.
- For valid JSON strings, parse and reserialize them with `JSON.stringify` and no indentation.
- For serializable non-string values, use `JSON.stringify` and no indentation.
- When compact serialization throws or returns `undefined`, copy the normalized display text.
- Disable the copy button when the resolved clipboard text is empty.

Search always operates on the readable display text. Copying never copies highlighted markup, match
status, or modal UI.

## Search and Navigation Behavior

- Build the search field with Angular signal forms, `form(...)`, an empty `schema(...)`, and
  `[formField]` inside `ms-signal-form-field`.
- Focus the search input after the viewer's first render for service-opened and declarative usage.
- Use `class="no-label no-message"` for the compact header field while retaining a native label and
  an independent `aria-label` on the search input.
- Trim the search query for behavior without rewriting the text shown in the input.
- When the trimmed query is empty, render the normalized value directly without highlight markup,
  hide the match status, and disable Previous and Next.
- When the query is nonempty, obtain safe parts from `HighlightPipe`; matching remains literal,
  case-insensitive, non-overlapping, and based on the entire trimmed query.
- Decorate the returned parts with an internal zero-based match ordinal. Do not change the public
  `HighlightPart` interface or `HighlightPipe` contract.
- Render matches with `mark` and nonmatches with inline `span` elements. Use Angular interpolation
  for every part and never generate HTML.
- Preserve the normalized value's whitespace, newlines, punctuation, and casing.
- Model the active match as dependent writable state with `linkedSignal`, resetting it immediately
  to the first result whenever the normalized value or trimmed query changes.
- When there are no results, use no active match and show `No matches`.
- When results exist, show a polite status such as `1 of 5`.
- Previous from the first match wraps to the last match. Next from the last match wraps to the first.
- Disable both navigation buttons when there are fewer than two matches.
- Enter in the search input selects the next match. Shift+Enter selects the previous match. Prevent
  the key event's default form behavior when navigation runs.
- Clicking Previous or Next, or using its keyboard shortcut, scrolls the active `mark` into view
  with logical inline nearest and block center alignment.
- Navigation does not move keyboard focus away from the search field or activated button.
- When the rendered match collection changes, synchronize scrolling only after Angular has rendered
  the new active result.

## Safe Rendering

- Return and render plain strings only; do not produce `SafeHtml` or HTML strings.
- Do not use `[innerHTML]`, `DomSanitizer`, `sanitize`, or `bypassSecurityTrustHtml`.
- Rely on Angular interpolation to escape the normalized value and every highlighted segment.
- HTML-like input such as `<script>alert('example')</script>` must remain visible inert text and
  must never become an element, attribute, or executable script.
- Regular-expression escaping in `HighlightPipe` protects literal matching and is separate from
  Angular's HTML escaping.
- Keep nonmatching text inside inline `span` elements so template indentation cannot insert spaces
  around adjacent highlighted text.

## Styling

Feature styles live in:

`src/styles/components/_value-viewer.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use concise hooks such as `.value-viewer-toolbar`, `.value-viewer-search`,
  `.value-viewer-match-status`, `.value-viewer-content`, and `.active-match`
- use existing color, spacing, radius, border, typography, control, focus-ring, and modal tokens
- make the projected header toolbar wrap responsively while allowing the search field to retain
  useful inline space
- render the value in a scrollable `pre`/`code` treatment with `white-space: pre-wrap` and
  `overflow-wrap: anywhere`
- style all matches with a subtle token-based background and give the active match a stronger
  token-based outline or background
- do not apply inline padding to `mark`, so highlighting never creates a visible gap inside a word
- use logical sizing, spacing, placement, and scroll alignment for LTR and RTL
- use `.ms-icon` for `search`, `content_copy`, `arrow_upward`, and `arrow_downward`; all four icons
  are already registered, so `MATERIAL_ICONS` does not change
- keep `.ms-icon { direction: ltr; }` unchanged for ligature rendering

## Accessibility

- Reuse `ms-modal` for dialog role, modal semantics, title association, backdrop behavior, and close
  button behavior.
- Service-opened usage inherits focus trapping, Escape handling, focus restoration, stacking, and
  scroll locking from `ModalService`.
- Give the search input the accessible name `Search value`.
- Move initial focus to the search input when the viewer opens so keyboard users can search
  immediately.
- Give icon-only controls the accessible names `Copy value`, `Previous match`, and `Next match`.
- Keep every icon decorative with `aria-hidden="true"` through the existing button components or
  explicit icon markup.
- Announce copied or failed state through the existing `ms-copy-button` live feedback.
- Render match position in a polite live region and use `aria-current="true"` only on the active
  match.
- Disabled navigation uses native `disabled` and is not communicated by icon or color alone.
- Do not make highlighted results focusable; navigation retains focus on the user's current control.
- Reading the content with assistive technology must preserve the normalized text in source order.

## Showcase

Add a `/value-viewer` showcase and link it from the home showcase grid under Components.

Demonstrate:

- service-opened multiline text with repeated case-insensitive matches
- a service-opened object with readable formatted display, compact JSON copy, a custom title, and
  modal shell overrides
- declarative `[value]`, `title`, and `(close)` usage
- blank search, no results, one result, repeated results, first/last wrapping, and
  Enter/Shift+Enter navigation
- literal regular-expression metacharacters
- empty string, `null`, `undefined`, nonserializable fallback, and HTML-like input
- responsive header wrapping and RTL layout

Keep snippets hand-authored in the showcase component `.ts` file. Each visual example renders a
matching full standalone Angular example through `ShowcaseCode` imported by the live showcase from
`src/app/shared/showcase-code`. Snippets import public APIs through `./shared/ui-lib`. Service
examples include `ModalOutletComponent` and render `<ms-modal-outlet />` so copied examples are
complete.

## Angular Rules

- Use standalone Angular APIs and do not add `standalone: true`.
- Use signals, `computed`, `linkedSignal`, `input`, `output`, and `inject()`.
- Use `@Service()` for `ValueViewerService`.
- Rely on Angular 22 default OnPush change detection.
- Use native `@if` and `@for` template control flow.
- Use Angular signal forms and `[formField]` for the search control.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `ValueViewerComponent`, `ValueViewerService`, and `ValueViewerOpenOptions` are exported through the
  feature, components, and root UI-library barrels.
- Service and declarative usage work with the documented public APIs.
- Service callers can override the title and existing modal shell settings.
- Strings, JSON strings, objects, primitives, unsupported values, and failed conversions resolve
  without throwing according to the display and copy contracts.
- The header uses the existing signal form field, copy button, and accessible Previous and Next
  controls.
- The search input receives focus when the viewer opens.
- Blank search renders unhighlighted content; nonblank search uses `HighlightPipe` and safely renders
  every segment through interpolation.
- Match status, first-result reset, wrapped navigation, Enter shortcuts, disabled states, active
  styling, and scrolling behave as documented.
- HTML-like values remain inert text, and the implementation contains no HTML binding or trust
  bypass.
- Layout is token-based, responsive, and correct in LTR and RTL.
- The showcase demonstrates the required service, declarative, formatting, copying, search,
  navigation, edge, and safety scenarios with matching copyable snippets.
- No duplicate modal outlet, overlay, clipboard implementation, formatter, or highlighter is added.
- The Angular build succeeds.
