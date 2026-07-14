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
- For reusable UI library components under `src/app/shared/ui-lib/components/`:
  - Use the `ms-` prefix for public Angular element selectors, such as `ms-modal` or `ms-menu-panel`.
  - Use concise unprefixed internal CSS class hooks, such as `.modal-header`, `.menu-panel`, or `.menu-item`; do not mirror the component prefix as `.ms-*` for new internal styling hooks.
  - Keep established public utility classes such as `.ms-icon` and `.ms-icon-filled` unchanged.
  - Use logical CSS properties and logical placement terms such as `inline-start`, `inline-end`, `block-start`, and `block-end` so component layouts mirror in both `dir="ltr"` and `dir="rtl"`.
  - Treat intentionally physical utilities such as `.text-left`, `.text-right`, `.ml-*`, and `.mr-*` as explicit consumer choices; reusable component layout should prefer logical equivalents.
  - Keep `.ms-icon { direction: ltr; }` as an intentional exception required for Material Symbols ligature rendering.
  - Keep the form-field family enterprise-dense and visually aligned: native inputs/selects, `ms-select`, and `ms-autocomplete` use the small control height token (`--control-height-sm`, 28px including the form-field border), form-control text uses `--font-size-sm` (14px), and form-field labels use `--color-text-muted`. Radio, checkbox, and switch labels should match that muted `--font-size-sm` label treatment. Account for wrapper borders when sizing projected controls so they do not increase the total field height.
  - Keep public component and directive classes focused on Angular behavior. When a shared feature exposes reusable public types, config interfaces, state/meta interfaces, or helper functions, place them in dedicated sibling files such as `*-types.ts`, `*-config.ts`, `*-state.ts`, or `*-meta.ts`, and re-export them from the feature folder `index.ts`.
  - Do not create extra type files for trivial components that only export a component/directive class and have no meaningful reusable public types or helpers.
  - For `ms-search-query-form`, keep frontend search operators aligned with backend wire names. Operators that do not take user-entered values, such as `isNull`, `isEmpty`, `isNullOrEmpty`, `isNotNull`, `isNotEmpty`, and `isNotNullOrEmpty`, should hide value inputs, skip value validators, keep filter state value as `null`, and emit request filters with `value: null`.
- Import reusable UI library APIs through the public `src/app/shared/ui-lib` barrel in showcase copy/paste snippets, such as `./shared/ui-lib`.
- For new showcase pages under `src/app/features/`, include copyable examples using
  `ShowcaseCode` from `src/app/shared/showcase-code`; do not export it from `ui-lib` barrels.
  - Keep snippets hand-authored in the feature component `.ts` file.
  - Snippets should be full standalone Angular component examples that users can copy/paste.
  - Keep the rendered showcase behavior and the copyable snippet behavior in sync. If a snippet uses a signal form model, `[formField]`, computed display state, validators, toggles, or other interaction state, the live showcase component/template should use the same behavior instead of static placeholder markup.
  - For Angular signal forms, bind controls with `[formField]` and define validation through `schema(...)` helpers such as `required`, `email`, `minLength`, `maxLength`, `min`, `pattern`, and related APIs. Do not place native validation attributes such as `required`, `minlength`, or `pattern` on the same control as `[formField]`.
  - When displaying live form-derived UI such as character counts, read from the signal form field/control state so the visible example updates while the user types.
  - Render snippets near the matching visual example with `<app-showcase-code>`.
  - On the form-fields showcase, render each form-field variant, including autocomplete variants, with its snippet directly below the visual example.
- Keep global form-control browser resets in `src/styles/base/_reset.scss`; number input spinner resets should be scoped to `input[type='number']` and cover both Firefox (`-moz-appearance: textfield`) and WebKit spin button pseudo-elements.
- Do not add/update tests for behavior changes.
