# Feature 032: Media Slider

## Goal

Create a reusable native media slider for horizontal photo or media browsing. The component uses browser scrolling and CSS scroll snap for smooth, mandatory snap positions while providing simple previous and next controls.

## Public API

Import public pieces from the folder barrel:

```ts
import {
  MediaCaptionDirective,
  MediaSlideComponent,
  MediaSliderComponent,
  type MediaSliderScrollBehavior,
  type MediaSliderSnapAlign,
} from '../../shared/ui-lib/components/media-slider';
```

Public pieces:

- `MediaSliderComponent` with selector `ms-media-slider`
  - `snapAlign: MediaSliderSnapAlign`, default `'center'`
  - `scrollBehavior: MediaSliderScrollBehavior`, default `'smooth'`
  - `slideSize: string`, default `'min(78vw, 22rem)'`
  - `aria-label: string`, default `'Media slider'`
  - `previousLabel: string`, default `'Previous item'`
  - `nextLabel: string`, default `'Next item'`
- `MediaSlideComponent` with selector `ms-media-slide`
- `MediaCaptionDirective` with selector `[msMediaCaption]`
- `MediaSliderSnapAlign = 'start' | 'center' | 'end'`
- `MediaSliderScrollBehavior = 'smooth' | 'auto'`

The shared component barrel also re-exports the feature from:

`src/app/shared/ui-lib/components/index.ts`

## Desired Usage

```html
<ms-media-slider aria-label="Featured photos">
  <ms-media-slide>
    <img src="/assets/photo-1.jpg" alt="Rocky coast at sunrise" />
    <p msMediaCaption>Morning coast study.</p>
  </ms-media-slide>

  <ms-media-slide>
    <img src="/assets/photo-2.jpg" alt="City street at dusk" />
  </ms-media-slide>
</ms-media-slider>
```

Use `slideSize` when one slide should dominate the visible track:

```html
<ms-media-slider slideSize="90%" aria-label="Large feature slides">
  <ms-media-slide>
    <img src="/assets/feature.jpg" alt="Product detail" />
    <p msMediaCaption>Each slide takes 90% of the slider track.</p>
  </ms-media-slide>
</ms-media-slider>
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/media-slider`

The feature includes:

- `MediaSliderComponent`
- `MediaSlideComponent`
- `MediaCaptionDirective`
- public type aliases
- `index.ts`

`ms-media-slider` renders the previous button, focusable scroll region, and next button. Consumers provide direct `ms-media-slide` children. Each slide projects its main media content and optionally projects `[msMediaCaption]` below it.

## Behavior

- The scroll track uses native horizontal overflow with `scroll-snap-type: inline mandatory`.
- Slide snap alignment is controlled by `snapAlign`; invalid values fall back to `'center'`.
- Slide width is controlled by `slideSize`; blank values fall back to `'min(78vw, 22rem)'`.
- The default center alignment adds inline scroll padding so the first and last slides can center in the track.
- Previous and next buttons scroll one slide by calling `scrollIntoView` on the target slide with `block: 'nearest'`.
- Button scrolling uses `scrollBehavior`; invalid values fall back to `'smooth'`.
- The active slide is the slide closest to the visual center of the scroll track.
- The previous button is disabled on the first slide.
- The next button is disabled on the last slide.
- Captions render only when `[msMediaCaption]` content is projected.
- Scroll and resize listeners are registered after render and cleaned up on destroy.
- No autoplay, looping, pagination dots, image-array API, or custom gesture handling is included.

## Projection and Composition Rules

- Consumers must project direct `ms-media-slide` children into `ms-media-slider`.
- `ms-media-slide` accepts arbitrary media, cards, or custom markup in its default slot.
- Caption content is placed below the media by adding `[msMediaCaption]` to projected content.
- The default slide media wrapper styles direct `img` and `video` children as full-width `4 / 3` media.

## Styling

Feature styles live in:

`src/styles/components/_media-slider.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

Styling rules:

- use existing tokens for color, spacing, radius, borders, motion, and focus rings
- use logical CSS properties and inline snap terminology
- use concise class hooks such as `.media-slider-track`, `.media-slide`, and `.media-slide-caption`
- keep Material Symbols rendered with `.ms-icon`
- keep RTL icon mirroring consistent with existing pagination controls
- expose component-private CSS custom properties with the `--_media-slider-*` prefix

## Accessibility

- The scroll track is keyboard-focusable and labelled with `aria-label`.
- Previous and next buttons are native buttons with configurable accessible labels.
- Decorative icon glyphs are hidden with `aria-hidden="true"`.
- Disabled button states use native `disabled`.
- Consumers remain responsible for accessible names on projected media, such as `alt` text for images.

## Showcase

The showcase lives in:

`src/app/features/media-slider`

The route is:

`/media-slider`

The home showcase grid includes a Media slider card. The showcase includes live examples for:

- default center-aligned photo slider
- large 90% single-slide view
- optional captions
- start and end alignment
- mixed projected content
- RTL behavior

Showcase snippets use `ShowcaseCode` and are hand-authored full standalone Angular examples.

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Use `ChangeDetectionStrategy.OnPush`.
- Prefer signals: `signal`, `computed`, `input`, `output`, `model`.
- Prefer `inject()` over constructor injection.
- Prefer `host` metadata in `@Component` over `@HostBinding` and `@HostListener`.
- Use native template control flow: `@if`, `@for`, `@switch`.
- Keep strict TypeScript.
- Avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- The public API is exported from the feature folder barrel.
- The feature is exported from the shared components barrel.
- Shared reusable components use the `ms-` selector prefix.
- Default snap alignment is centered.
- Previous and next controls scroll one slide and disable at the ends.
- Caption space appears only when a slide projects `[msMediaCaption]`.
- Styling is forwarded from the components style index.
- The `/media-slider` showcase route is registered and linked from the home showcase grid.
- Reusable layout behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- The showcase demonstrates core variants and renders matching copyable snippets.
