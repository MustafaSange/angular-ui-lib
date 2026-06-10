---
name: angular-shared-feature-spec
description: For creating, implementing, reviewing, or documenting reusable Angular shared components, directives, and utilities under src/app/shared.
---

# Angular Shared Feature Spec Skill

Apply this skill when working on reusable Angular shared features.

## Operating modes

### Documentation mode
Describe existing implementation only.

Rules:
- read implementation before writing
- document only verified behavior
- omit unverifiable claims
- never infer missing APIs

### Creation mode
Generate implementation that satisfies this specification.

Rules:
- public API must be intentional and minimal
- implementation must match documented behavior
- all examples must compile

---

## Required verification

Before writing:

Read existing files if present:

- barrel export file
- component/directive/service files
- templates
- styles
- tests
- showcase/demo files
- AGENTS.md / agent.md

Rules:
- only reference files that exist
- if a file is absent, omit it
- never invent structure

---

## Public API rules

Document only actual public exports from the feature barrel.

For each export include:

- name
- purpose
- type
- default values (if applicable)

Rules:
- if export cannot be verified, omit it
- never infer hidden exports
- keep API minimal and reusable

---

## Usage example rules

Examples must:

- compile unchanged
- use only documented public APIs
- be syntactically valid Angular
- avoid pseudo-code
- avoid private selectors
- avoid internal implementation details
- avoid hypothetical inputs/outputs
- match the behavior of the rendered showcase when the example is paired with a live demo

For Angular signal-form examples:

- include the signal model, `form(...)`, `schema(...)`, imported `FormField`, and bound `[formField]` controls when those APIs are required by the demo behavior
- define validation in `schema(...)` with signal-form validators such as `required`, `email`, `minLength`, `maxLength`, `min`, and `pattern`
- do not place native validation attributes such as `required`, `minlength`, or `pattern` on controls that also use `[formField]`
- derive live UI such as character counts or validation messages from signal form state so the rendered showcase updates while users interact

---

## Showcase rules

Showcases must:

- keep the visible demo and copyable snippet behavior in sync
- render snippets near the visual example with the project `ShowcaseCode` component when used in `src/app/features`
- avoid static placeholder markup when the snippet demonstrates state, validation, computed values, or interactive behavior
- use public UI library imports in copyable snippets through the project barrel, such as `./shared/ui-lib`

---

## Architecture rules

Shared features must:

- remain reusable
- remain framework-consistent
- avoid app-specific business logic
- avoid feature-domain terminology
- avoid route/store/backend coupling
- avoid unrelated utilities

Prefer:

- standalone Angular APIs when project supports them
- `@Service()` for root-provided services in Angular 22+ projects
- rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`
- content projection for reusable composition
- explicit inputs/outputs
- minimal dependencies

---

## Behavior requirements

Behavior documentation must be implementation-ready.

Include where relevant:

- states
- transitions
- lifecycle/setup/cleanup
- interactions
- keyboard behavior
- focus behavior
- error/loading/disabled handling

---

## Styling rules

Use:

- design tokens
- logical CSS properties
- RTL-safe styling
- responsive layouts

Avoid:

- hardcoded directional styles
- arbitrary styling exceptions
- app-specific theme assumptions

---

## Accessibility rules

Accessibility is mandatory.

Require:

- semantic HTML first
- ARIA only when necessary
- keyboard operability
- visible focus management
- screen reader compatibility
- disabled/readonly behavior definition

---

## Output structure

Use sections only when applicable:

- Goal
- Non-Goals
- Public API
- Desired Usage
- Component Structure
- Behavior
- Composition Rules
- Styling
- Accessibility
- Showcase
- Project Rules
- Acceptance Criteria

Remove non-applicable sections.

---

## Acceptance criteria

Before finishing verify:

- public API exported from barrel
- examples compile unchanged
- implementation matches documented behavior
- styling follows project conventions
- RTL works
- accessibility requirements are met
- showcase matches public API
- showcase snippets match the visible demo behavior

If implementation conflicts with requirements:
document actual behavior and explicitly note mismatch.
