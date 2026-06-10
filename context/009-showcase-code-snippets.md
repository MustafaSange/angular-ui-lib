# Feature 009: Showcase Code Snippets

## Goal

Every feature showcase should pair visual examples with copyable code snippets so users can quickly paste working examples into another Angular app.

## Shared Component

Use the shared snippet viewer:

`src/app/shared/ui-lib/components/showcase-code`

Import it in showcase feature components:

```ts
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';
```

Use it in the component `imports` array.

## Usage

Render snippets with:

```html
<app-showcase-code label="Example label" [code]="snippet" />
```

For repeated examples, store snippets as an array and render them with `@for`.

## Snippet Rules

- Keep snippets hand-authored in the feature component `.ts` file.
- Snippets should be full standalone Angular component examples.
- Include all imports needed for the example.
- In copy/paste snippet content, import reusable UI library APIs from `./shared/ui-lib`.
- Keep the rendered visual example and copyable snippet behavior in sync. When the snippet uses
  signals, computed values, signal forms, validators, or interaction state, the live showcase should
  use the same behavior instead of static placeholder markup.
- Include a `styles` array when the snippet introduces local CSS classes that are not public
  utilities or shared component classes.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Do not add `standalone: true`.
- Prefer signals, signal forms, and native Angular control flow where relevant.
- For Angular signal-form snippets, include the signal model, `form(...)`, `schema(...)`, imported
  `FormField`, and `[formField]` bindings when those APIs are part of the demo behavior.
- Define signal-form validation through `schema(...)` validators such as `required`, `email`,
  `minLength`, `maxLength`, `min`, and `pattern`. Do not use native validation attributes such as
  `required`, `minlength`, or `pattern` on controls that also use `[formField]`.
- Derive live UI such as character counts, selected labels, and error messages from the same state
  used by the live example.
- Keep snippets focused on the component or utility being showcased.
- Place each snippet near the matching visual example.
- For form-field variants, place the snippet directly below the matching visual field rather than beside it.

## Styling Rules

- Use the existing `ShowcaseCode` component styling.
- Add only local spacing/layout styles in the feature page when needed.
- Keep code blocks readable on mobile with horizontal scrolling.
- Do not create a new code viewer for each feature.
- Prefer local vertical stacks when adjacent preview/code columns make the showcase harder to scan.

## Acceptance Criteria

- New showcase pages include at least one copyable full-component snippet per major example or section.
- The snippet can be copied with the built-in copy button.
- Snippet content matches the visual example behavior closely enough to be pasted and adapted.
- Showcase pages keep their existing visual examples and add snippets without replacing the live demo.
