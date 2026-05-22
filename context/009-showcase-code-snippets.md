# Feature 009: Showcase Code Snippets

## Goal
Every feature showcase should pair visual examples with copyable code snippets so users can quickly paste working examples into another Angular app.

## Shared Component
Use the shared snippet viewer:

`src/app/shared/components/showcase-code`

Import it in showcase feature components:

```ts
import { ShowcaseCode } from '../../shared/components/showcase-code';
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
- Use `ChangeDetectionStrategy.OnPush`.
- Do not add `standalone: true`.
- Prefer signals, signal forms, and native Angular control flow where relevant.
- Keep snippets focused on the component or utility being showcased.
- Place each snippet near the matching visual example.

## Styling Rules

- Use the existing `ShowcaseCode` component styling.
- Add only local spacing/layout styles in the feature page when needed.
- Keep code blocks readable on mobile with horizontal scrolling.
- Do not create a new code viewer for each feature.

## Acceptance Criteria

- New showcase pages include at least one copyable full-component snippet per major example or section.
- The snippet can be copied with the built-in copy button.
- Snippet content matches the visual example closely enough to be pasted and adapted.
- Showcase pages keep their existing visual examples and add snippets without replacing the live demo.
