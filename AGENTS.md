# Angular Agent Instructions

This project uses Angular 21, Vitest, SCSS, and standalone bootstrap APIs.

Use modern Angular patterns:
- Standalone APIs only; do not create NgModules unless required.
- Do not add `standalone: true`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Use `ChangeDetectionStrategy.OnPush`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Prefer reactive forms for non-trivial forms.
- Keep strict TypeScript; avoid `any`.
- Match existing project style:
  - root component class is `App`
  - app template/style files are `app.html` and `app.scss`
  - routes are in `src/app/app.routes.ts`
- Do not add/update tests for behavior changes.
