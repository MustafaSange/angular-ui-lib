## Template Usage

Use this template for reusable shared Angular features.

Before writing:

- Replace all placeholders.
- Remove sections that do not apply.
- Do not invent APIs, services, configs, or showcase examples unless required.
- All examples must compile exactly as written.

---

## Goal

Describe:

- the feature’s purpose
- the primary use case
- the expected user/library outcome

Do not include implementation details.

---

## Non-Goals

Describe what this feature should NOT do.

Examples:

- duplicate existing shared functionality
- include app-specific business logic
- introduce unrelated utilities

---

## Public API

Document only actual public exports from the feature barrel.

For each export, include:

- name
- purpose
- type
- default values (if applicable)

Example:

```ts
import { FeatureComponent } from '../../shared/ui-lib';
```

---

## Desired Usage

Show real consumer usage.

Rules:

- examples must compile
- reflect final API
- no pseudo-code
- no internal implementation details

Example:

```html
<ms-feature-name>Feature content</ms-feature-name>
```

---

## Component Structure

Location:

`src/app/shared/ui-lib/components/feature-name`

Document:

- required public files
- optional supporting files
- rendered structure
- responsibilities
- composition model

---

## Behavior

Document implementation-ready behavior.

Include where relevant:

- states (`default`, `disabled`, `loading`, `error`, etc.)
- interactions (click, keyboard, pointer, gestures)
- lifecycle/setup/cleanup
- exact state transitions

Example:

- Escape closes dropdown
- outside click dismisses overlay

---

## Composition Rules

Document how consumers provide content.

Include:

- projection vs inputs
- named slots
- child directives/components
- generated IDs / ARIA wiring

Remove if not applicable.

---

## Styling

Document:

- style file location
- responsive behavior
- RTL requirements
- CSS custom property APIs
- icon rules
- any styling exceptions

Use design tokens and logical CSS properties.

---

## Accessibility

Document exact accessibility requirements.

Include:

- semantic elements
- ARIA roles/relationships
- keyboard behavior
- focus handling
- screen reader expectations
- disabled/readonly behavior

Remove if native semantics are sufficient.

---

## Showcase

For visual reusable components:

- add showcase examples
- include copyable snippets
- ensure snippets compile

Remove if no visual UI.

---

## Project Rules

Follow `agent.md`.

Document only feature-specific deviations here.

---

## Acceptance Criteria

- public API exported from barrel
- examples compile unchanged
- documented behavior implemented
- styling follows conventions
- RTL works correctly
- accessibility requirements met
- showcase matches public API
