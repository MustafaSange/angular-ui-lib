# Angular Agent Instructions

This project uses Angular 22, Vitest, SCSS, and standalone bootstrap APIs.

Use modern Angular patterns:

- Standalone APIs only; do not create NgModules unless required.
- Do not add `standalone: true`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `@Service()` for root-provided services instead of `@Injectable({ providedIn: 'root' })`.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Rely on Angular 22 default OnPush change detection; do not add explicit `changeDetection` metadata unless overriding to `ChangeDetectionStrategy.Eager`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Prefer reactive forms for non-trivial forms.
- Keep strict TypeScript; avoid `any`.
- Match existing project style:
  - root component class is `App`
  - app template/style files are `app.html` and `app.scss`
  - routes are in `src/app/app.routes.ts`
- For reusable components under `src/app/shared/`:
  - Use the `ms-` prefix for public Angular element selectors, such as `ms-modal` or `ms-menu-panel`.
  - Use concise unprefixed internal CSS class hooks, such as `.modal-header`, `.menu-panel`, or `.menu-item`; do not mirror the component prefix as `.ms-*` for new internal styling hooks.
  - Keep established public utility classes such as `.ms-icon` and `.ms-icon-filled` unchanged.
  - Use logical CSS properties and logical placement terms such as `inline-start`, `inline-end`, `block-start`, and `block-end` so component layouts mirror in both `dir="ltr"` and `dir="rtl"`.
  - Treat intentionally physical utilities such as `.text-left`, `.text-right`, `.ml-*`, and `.mr-*` as explicit consumer choices; reusable component layout should prefer logical equivalents.
  - Keep `.ms-icon { direction: ltr; }` as an intentional exception required for Material Symbols ligature rendering.
  - Keep public component and directive classes focused on Angular behavior. When a shared feature exposes reusable public types, config interfaces, state/meta interfaces, or helper functions, place them in dedicated sibling files such as `*-types.ts`, `*-config.ts`, `*-state.ts`, or `*-meta.ts`, and re-export them from the feature folder `index.ts`.
  - Do not create extra type files for trivial components that only export a component/directive class and have no meaningful reusable public types or helpers.
- For new showcase pages under `src/app/features/`, include copyable examples using
  `ShowcaseCode` from `src/app/shared/components/showcase-code`.
  - Keep snippets hand-authored in the feature component `.ts` file.
  - Snippets should be full standalone Angular component examples that users can copy/paste.
  - Render snippets near the matching visual example with `<app-showcase-code>`.
  - On the form-fields showcase, render each form-field variant with its snippet directly below the visual example.
- Do not add/update tests for behavior changes.
