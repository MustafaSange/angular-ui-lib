# Feature 043: Format JSON Pipe

## Goal

Provide a reusable Angular pipe that renders valid JSON with consistent, readable indentation while
leaving values unchanged when they cannot be parsed or serialized as JSON.

## Public API

Import the pipe from the public UI library barrel:

```ts
import { FormatJsonPipe } from './shared/ui-lib';
```

Public pieces:

- `FormatJsonPipe` with pipe name `formatJson`
- `transform(value)` accepts `unknown`

The pipe returns a two-space-indented JSON string when the input is a valid JSON string or can be
serialized with `JSON.stringify`. When parsing or serialization fails, or serialization produces no
string, the original value is returned unchanged.

## Desired Usage

Format a JSON string in a template:

```html
<pre>{{ payload | formatJson }}</pre>
```

A complete standalone Angular example:

```ts
import { Component } from '@angular/core';
import { FormatJsonPipe } from './shared/ui-lib';

@Component({
  selector: 'app-format-json-example',
  imports: [FormatJsonPipe],
  template: `
    <pre>{{ payload | formatJson }}</pre>
    <p>{{ plainText | formatJson }}</p>
  `,
})
export class FormatJsonExample {
  readonly payload = '{"name":"Ada","active":true}';
  readonly plainText = 'Not JSON';
}
```

The first value renders as:

```json
{
  "name": "Ada",
  "active": true
}
```

The second value renders unchanged as `Not JSON`.

## Structure

The implementation lives in:

`src/app/shared/ui-lib/pipes/format-json.pipe.ts`

The public exports live in:

- `src/app/shared/ui-lib/pipes/index.ts`
- `src/app/shared/ui-lib/index.ts`

No component, template, styles, service, or additional public types are required.

## Behavior

- Parse string inputs with `JSON.parse` before formatting them.
- Pass non-string inputs directly to `JSON.stringify`.
- Format successful results with two-space indentation.
- Support valid JSON primitives, arrays, objects, and `null`.
- Return the original input when a string is not valid JSON.
- Return the original input when serialization throws, including circular structures and values
  containing `bigint`.
- Return the original input when `JSON.stringify` returns `undefined`, including a top-level
  `undefined`, function, or symbol.
- Do not mutate the input.
- Keep the pipe pure so Angular recalculates it only when the input reference or primitive value
  changes.

## Showcase

The showcase lives at `/format-json` and is linked from the home showcase grid.

It demonstrates:

- parsing and formatting a valid JSON string
- serializing and formatting a structured object
- returning an invalid JSON string unchanged

Each example renders a matching copyable standalone Angular component with `ShowcaseCode`. Snippets
import `FormatJsonPipe` from the public `./shared/ui-lib` barrel.

## Angular Rules

- Use a standalone Angular pipe; do not add `standalone: true`.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `FormatJsonPipe` is available from the public `src/app/shared/ui-lib` barrel.
- Valid JSON strings produce two-space-indented JSON.
- Serializable non-string values produce two-space-indented JSON.
- Invalid JSON strings and values that cannot be serialized are returned unchanged without throwing.
- Inputs are not mutated.
- The documented standalone example compiles against the public API.
- The `/format-json` showcase demonstrates string, object, and invalid inputs with matching copyable
  snippets.
- The Angular build succeeds.
