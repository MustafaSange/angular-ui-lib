import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';
import { BadgeComponent, DrawerClose, DrawerComponent } from '../../shared/ui-lib';

type UtilityDemo =
  | 'display'
  | 'flex'
  | 'gaps'
  | 'spacing'
  | 'typography'
  | 'colors'
  | 'borders'
  | 'shadows'
  | 'sizing'
  | 'position'
  | 'states';

interface UtilityClass {
  readonly name: string;
  readonly description: string;
  readonly example?: string;
}

interface UtilityGroup {
  readonly id: UtilityDemo;
  readonly category: string;
  readonly title: string;
  readonly summary: string;
  readonly benefit: string;
  readonly guidance: string;
  readonly samples: readonly string[];
  readonly usedClasses: readonly string[];
  readonly useWhen: readonly string[];
  readonly avoidWhen: readonly string[];
  readonly classes: readonly UtilityClass[];
  readonly snippet: string;
}

@Component({
  selector: 'app-utilities',
  imports: [BadgeComponent, DrawerClose, DrawerComponent, RouterLink, ShowcaseCode],
  templateUrl: './utilities.html',
  styleUrls: ['./utilities.scss', './utilities-demo.scss', './utilities-guidance.scss'],
})
export class Utilities {
  protected readonly groups: readonly UtilityGroup[] = [
    {
      id: 'display',
      category: 'Layout',
      title: 'Display',
      summary: 'Control block, inline, flex, grid, and hidden rendering.',
      benefit: 'Switch an element between ordinary content, layout container, and hidden state.',
      guidance:
        'Use display utilities for quick layout primitives and responsive visibility changes.',
      samples: ['d-block', 'd-flex', 'd-grid', 'd-none'],
      usedClasses: ['d-flex', 'd-grid', 'd-none', 'md-d-flex'],
      useWhen: [
        'Changing an element into a layout parent.',
        'Hiding or revealing content at a breakpoint.',
      ],
      avoidWhen: [
        'The element needs complex layout rules that are easier to maintain in component CSS.',
      ],
      classes: [
        { name: 'd-block', description: 'Renders the element as a block.' },
        { name: 'd-inline', description: 'Keeps the element inline.' },
        { name: 'd-inline-block', description: 'Combines inline flow with box sizing.' },
        { name: 'd-flex', description: 'Creates a flex formatting context.' },
        { name: 'd-inline-flex', description: 'Creates an inline flex container.' },
        { name: 'd-grid', description: 'Creates a grid formatting context.' },
        { name: 'd-none', description: 'Removes the element from layout.' },
        { name: 'sm-d-block / md-d-block / lg-d-block / xl-d-block', description: 'Responsive block display.' },
        { name: 'sm-d-inline / md-d-inline / lg-d-inline / xl-d-inline', description: 'Responsive inline display.' },
        { name: 'sm-d-inline-block / md-d-inline-block / lg-d-inline-block / xl-d-inline-block', description: 'Responsive inline-block display.' },
        { name: 'sm-d-flex / md-d-flex / lg-d-flex / xl-d-flex', description: 'Responsive flex display.' },
        { name: 'sm-d-inline-flex / md-d-inline-flex / lg-d-inline-flex / xl-d-inline-flex', description: 'Responsive inline-flex display.' },
        { name: 'sm-d-grid / md-d-grid / lg-d-grid / xl-d-grid', description: 'Responsive grid display.' },
        { name: 'sm-d-none / md-d-none / lg-d-none / xl-d-none', description: 'Responsive visibility control.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-display-utilities-example',
  template: \`
    <div class="d-flex gap-12 align-center">
      <span class="p-12 rounded-md bg-primary-subtle">One</span>
      <span class="p-12 rounded-md bg-success-subtle">Two</span>
      <span class="p-12 rounded-md bg-warning-subtle">Three</span>
    </div>
  \`,
})
export class DisplayUtilitiesExample {}`,
    },
    {
      id: 'flex',
      category: 'Layout',
      title: 'Flex',
      summary: 'Compose direction, wrapping, growth, alignment, and distribution.',
      benefit: 'Align controls, metadata, and actions without writing one-off layout CSS.',
      guidance:
        'Pair flex utilities with display and gap helpers for compact, responsive arrangements.',
      samples: ['flex-row', 'flex-wrap', 'justify-between', 'align-center'],
      usedClasses: ['d-flex', 'align-center', 'justify-between', 'gap-16'],
      useWhen: [
        'Aligning icons, labels, metadata, and actions in one row or column.',
        'Distributing simple groups of controls without custom CSS.',
      ],
      avoidWhen: [
        'The layout needs named grid areas or multi-dimensional placement.',
      ],
      classes: [
        { name: 'flex-row', description: 'Sets horizontal flex direction.' },
        { name: 'flex-column', description: 'Sets vertical flex direction.' },
        { name: 'flex-wrap', description: 'Allows flex items to wrap.' },
        { name: 'flex-nowrap', description: 'Prevents flex items from wrapping.' },
        { name: 'flex-1', description: 'Lets an item fill available space.' },
        { name: 'flex-grow-0', description: 'Prevents an item from growing.' },
        { name: 'flex-grow-1', description: 'Allows an item to grow.' },
        { name: 'flex-shrink-0', description: 'Prevents an item from shrinking.' },
        { name: 'flex-shrink-1', description: 'Allows an item to shrink.' },
        { name: 'justify-start', description: 'Packs items at the main-axis start.' },
        { name: 'justify-center', description: 'Centers items on the main axis.' },
        { name: 'justify-end', description: 'Packs items at the main-axis end.' },
        { name: 'justify-between', description: 'Places space between items.' },
        { name: 'justify-around', description: 'Places space around items.' },
        { name: 'justify-evenly', description: 'Places even space between and around items.' },
        { name: 'align-start', description: 'Aligns items at the cross-axis start.' },
        { name: 'align-center', description: 'Centers items on the cross axis.' },
        { name: 'align-end', description: 'Aligns items at the cross-axis end.' },
        { name: 'align-stretch', description: 'Stretches items on the cross axis.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-flex-utilities-example',
  template: \`
    <div class="d-flex align-center justify-between gap-16">
      <strong>Project status</strong>
      <span class="px-12 py-4 rounded-full bg-success-subtle text-success">Ready</span>
    </div>
  \`,
})
export class FlexUtilitiesExample {}`,
    },
    {
      id: 'gaps',
      category: 'Layout',
      title: 'Gaps',
      summary: 'Set grid and flex spacing between children.',
      benefit: 'Keep spacing on the parent so child components stay reusable.',
      guidance:
        'Use gap utilities instead of child margins when spacing belongs to the parent layout.',
      samples: ['gap-12', 'row-gap-16', 'column-gap-24'],
      usedClasses: ['d-grid', 'gap-12'],
      useWhen: [
        'Spacing repeated children in a flex or grid container.',
        'Keeping child components free of layout margins.',
      ],
      avoidWhen: [
        'Only one child needs a unique offset or alignment adjustment.',
      ],
      classes: [
        { name: 'gap-0 / 2 / 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 40 / 48', description: 'Sets row and column gap together.' },
        { name: 'row-gap-0 / 2 / 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 40 / 48', description: 'Sets only the block-axis gap.' },
        { name: 'column-gap-0 / 2 / 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 40 / 48', description: 'Sets only the inline-axis gap.' },
        { name: 'sm-gap-* / md-gap-* / lg-gap-* / xl-gap-*', description: 'Responsive gap utilities using the same spacing scale.' },
        { name: 'sm-row-gap-* / md-row-gap-* / lg-row-gap-* / xl-row-gap-*', description: 'Responsive row-gap utilities.' },
        { name: 'sm-column-gap-* / md-column-gap-* / lg-column-gap-* / xl-column-gap-*', description: 'Responsive column-gap utilities.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-gap-utilities-example',
  template: \`
    <div class="d-grid gap-12">
      <button class="btn btn-primary" type="button">Save</button>
      <button class="btn btn-outline" type="button">Preview</button>
    </div>
  \`,
})
export class GapUtilitiesExample {}`,
    },
    {
      id: 'spacing',
      category: 'Layout',
      title: 'Spacing',
      summary: 'Apply margin and padding with token-backed utility classes.',
      benefit: 'Use consistent design-system spacing without creating local CSS for each block.',
      guidance:
        'Prefer logical spacing utilities for reusable layouts; physical utilities remain explicit consumer choices.',
      samples: ['m-16', 'px-24', 'ms-auto', 'py-8'],
      usedClasses: ['p-20', 'mt-4', 'gap-12', 'px-20', 'pb-20'],
      useWhen: [
        'Applying token-backed rhythm directly in simple templates.',
        'Using logical spacing for reusable LTR and RTL layouts.',
      ],
      avoidWhen: [
        'Spacing is part of a reusable component contract and should live in component styles.',
      ],
      classes: [
        { name: 'm-0 / 2 / 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 40 / 48', description: 'Applies margin on all sides.' },
        { name: 'p-0 / 2 / 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 / 40 / 48', description: 'Applies padding on all sides.' },
        { name: 'mt-* / mr-* / mb-* / ml-*', description: 'Applies explicit physical margin by side.' },
        { name: 'pt-* / pr-* / pb-* / pl-*', description: 'Applies explicit physical padding by side.' },
        { name: 'ms-* / me-* / mx-* / my-*', description: 'Applies logical margin on inline start/end, inline, or block axes.' },
        { name: 'ps-* / pe-* / px-* / py-*', description: 'Applies logical padding on inline start/end, inline, or block axes.' },
        { name: 'm-auto / mt-auto / mr-auto / mb-auto / ml-auto', description: 'Applies auto margin on all or physical sides.' },
        { name: 'ms-auto / me-auto / mx-auto / my-auto', description: 'Applies logical auto margin.' },
        { name: 'sm-* / md-* / lg-* / xl-* spacing classes', description: 'Responsive spacing variants for the same margin and padding utilities.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-spacing-utilities-example',
  template: \`
    <section class="p-20 rounded-lg border bg-surface">
      <h2 class="mb-8 text-lg">Spacing</h2>
      <p class="m-0 text-secondary">Padding and margin come from shared spacing tokens.</p>
    </section>
  \`,
})
export class SpacingUtilitiesExample {}`,
    },
    {
      id: 'typography',
      category: 'Content',
      title: 'Typography',
      summary: 'Adjust type size, weight, alignment, and transform.',
      benefit: 'Tune hierarchy and metadata text while staying on the shared type scale.',
      guidance:
        'Use typography utilities for small local adjustments while keeping the token scale consistent.',
      samples: ['text-sm', 'text-lg', 'fw-semibold', 'text-start'],
      usedClasses: ['text-sm', 'text-muted', 'text-uppercase', 'text-xl', 'fw-semibold'],
      useWhen: [
        'Creating local hierarchy for metadata, titles, and helper copy.',
        'Keeping copy on the shared font size and weight scale.',
      ],
      avoidWhen: [
        'A component needs a reusable typographic kind with its own semantic API.',
      ],
      classes: [
        { name: 'text-xs / text-sm / text-md / text-lg / text-xl / text-2xl', description: 'Sets font size from the token scale.' },
        { name: 'fw-light / fw-regular / fw-medium / fw-semibold / fw-bold', description: 'Sets font weight from the token scale.' },
        { name: 'text-start / text-end', description: 'Applies logical text alignment.' },
        { name: 'text-left / text-right', description: 'Applies explicit physical alignment.' },
        { name: 'text-uppercase', description: 'Transforms text to uppercase.' },
        { name: 'text-lowercase / text-capitalize', description: 'Applies casing transforms.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-typography-utilities-example',
  template: \`
    <article>
      <p class="m-0 text-sm text-muted text-uppercase">Release</p>
      <h2 class="m-0 text-xl fw-semibold">Typography Utilities</h2>
      <p class="mt-8 text-secondary">Use token-backed type helpers for compact UI copy.</p>
    </article>
  \`,
})
export class TypographyUtilitiesExample {}`,
    },
    {
      id: 'colors',
      category: 'Theme',
      title: 'Colors',
      summary: 'Apply semantic text, background, surface, and border colors.',
      benefit: 'Communicate meaning with theme-safe colors that adapt with the design system.',
      guidance:
        'Use semantic utilities to keep color meaning consistent across light, dark, and themed surfaces.',
      samples: ['text-primary', 'bg-success', 'bg-surface', 'border-danger'],
      usedClasses: ['bg-success-subtle', 'text-success', 'bg-warning-subtle', 'text-warning'],
      useWhen: [
        'Communicating status, emphasis, or surface role with existing tokens.',
        'Keeping colors theme-aware instead of hardcoding values.',
      ],
      avoidWhen: [
        'Color carries business meaning that should be controlled by component inputs.',
      ],
      classes: [
        { name: 'text-primary / text-secondary / text-muted / text-inverse', description: 'Sets structural text color.' },
        { name: 'text-accent / text-success / text-warning / text-danger / text-info', description: 'Sets semantic text color.' },
        { name: 'bg-primary / bg-secondary / bg-accent / bg-success / bg-warning / bg-danger / bg-info', description: 'Sets semantic background and contrast text.' },
        { name: 'bg-primary-subtle / secondary-subtle / accent-subtle / success-subtle / warning-subtle / danger-subtle / info-subtle', description: 'Sets subtle semantic background color.' },
        { name: 'bg-background / bg-surface / bg-surface-muted / bg-surface-raised / bg-surface-overlay', description: 'Sets structural surface colors.' },
        { name: 'border-primary / secondary / accent / success / warning / danger / info', description: 'Sets semantic border color.' },
        { name: 'border-default / border-strong', description: 'Sets structural border color.' },
      ],
      snippet: `import { Component } from '@angular/core';

import { BadgeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-color-utilities-example',
  imports: [BadgeComponent],
  template: \`
    <div class="d-flex flex-wrap gap-12">
      <ms-badge kind="success">Success</ms-badge>
      <ms-badge kind="warning">Warning</ms-badge>
      <ms-badge kind="danger">Danger</ms-badge>
    </div>
  \`,
})
export class ColorUtilitiesExample {}`,
    },
    {
      id: 'borders',
      category: 'Surface',
      title: 'Borders',
      summary: 'Apply standard borders and radius treatments.',
      benefit: 'Frame lightweight surfaces and pills using the same radius and border tokens.',
      guidance:
        'Use border and radius utilities for simple framed surfaces that do not need a custom component.',
      samples: ['border', 'border-0', 'rounded-md', 'rounded-full'],
      usedClasses: ['border', 'rounded-lg'],
      useWhen: [
        'Framing small surfaces, list items, pills, or previews.',
        'Applying token-backed radius without writing new CSS.',
      ],
      avoidWhen: [
        'The border is part of a stateful component kind such as selected, invalid, or active.',
      ],
      classes: [
        { name: 'border', description: 'Applies the default border width and color.' },
        { name: 'border-0', description: 'Removes borders.' },
        { name: 'rounded-0', description: 'Removes border radius.' },
        { name: 'rounded-sm / rounded-md / rounded-lg / rounded-xl', description: 'Applies token-backed radius sizes.' },
        { name: 'rounded-full', description: 'Creates fully rounded pills or circles.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-border-utilities-example',
  template: \`
    <div class="border rounded-lg p-16 bg-surface">
      <span class="px-12 py-4 rounded-full bg-primary-subtle text-primary">Bordered</span>
    </div>
  \`,
})
export class BorderUtilitiesExample {}`,
    },
    {
      id: 'shadows',
      category: 'Surface',
      title: 'Shadows',
      summary: 'Apply token-backed elevation shadows.',
      benefit: 'Separate raised content from the page without inventing new elevation values.',
      guidance:
        'Use shadows sparingly for raised interactive or overlay-like surfaces.',
      samples: ['shadow-sm', 'shadow-md', 'shadow-lg'],
      usedClasses: ['shadow-md', 'rounded-lg', 'bg-surface-raised'],
      useWhen: [
        'Raising cards, popovers, menus, or temporary panels above the page.',
      ],
      avoidWhen: [
        'Depth is decorative and does not communicate layering or interaction.',
      ],
      classes: [
        { name: 'shadow-sm', description: 'Applies subtle raised depth.' },
        { name: 'shadow-md', description: 'Applies medium elevation.' },
        { name: 'shadow-lg', description: 'Applies the strongest utility elevation.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-shadow-utilities-example',
  template: \`
    <div class="shadow-md rounded-lg p-20 bg-surface-raised">
      Raised surface
    </div>
  \`,
})
export class ShadowUtilitiesExample {}`,
    },
    {
      id: 'sizing',
      category: 'Layout',
      title: 'Sizing',
      summary: 'Set full width, full height, and viewport minimum height.',
      benefit: 'Lock common container dimensions with predictable, readable class names.',
      guidance:
        'Use sizing helpers for common container constraints without repeating one-off CSS.',
      samples: ['w-full', 'h-full', 'min-h-vh', 'min-h-svh'],
      usedClasses: ['w-full'],
      useWhen: [
        'Making form controls, panels, or containers fill available space.',
        'Applying common viewport-height constraints.',
      ],
      avoidWhen: [
        'The component needs precise responsive sizing rules or aspect ratios.',
      ],
      classes: [
        { name: 'w-full', description: 'Sets width to 100%.' },
        { name: 'h-full', description: 'Sets height to 100%.' },
        { name: 'min-h-vh', description: 'Sets min-height to 100vh.' },
        { name: 'min-h-svh', description: 'Sets min-height to 100svh.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-sizing-utilities-example',
  template: \`
    <div class="w-full p-16 rounded-md bg-surface-muted">
      This utility block spans the available inline size.
    </div>
  \`,
})
export class SizingUtilitiesExample {}`,
    },
    {
      id: 'position',
      category: 'Layout',
      title: 'Position',
      summary: 'Set common positioning modes.',
      benefit: 'Create badge, dot, and overlay anchors with a clear positioning context.',
      guidance:
        'Use position utilities for small overlays, badges, or local anchoring contexts.',
      samples: ['position-relative', 'position-absolute', 'position-fixed'],
      usedClasses: ['position-relative', 'position-absolute'],
      useWhen: [
        'Anchoring badges, dots, or small overlays inside a local card or button.',
      ],
      avoidWhen: [
        'The positioned element needs collision handling, scrolling logic, or viewport-aware placement.',
      ],
      classes: [
        { name: 'position-relative', description: 'Creates a relative positioning context.' },
        { name: 'position-absolute', description: 'Removes the element from normal flow.' },
        { name: 'position-fixed', description: 'Positions the element relative to the viewport.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-position-utilities-example',
  template: \`
    <div class="position-relative p-24 rounded-lg bg-surface-muted">
      Anchored content
      <span class="position-absolute utility-dot" aria-hidden="true"></span>
    </div>
  \`,
  styles: [\`
    .utility-dot {
      inset-block-start: 0.75rem;
      inset-inline-end: 0.75rem;
      inline-size: 0.5rem;
      block-size: 0.5rem;
      border-radius: 999px;
      background: var(--color-success);
    }
  \`],
})
export class PositionUtilitiesExample {}`,
    },
    {
      id: 'states',
      category: 'State',
      title: 'States',
      summary: 'Apply muted and disabled opacity treatments.',
      benefit: 'Show lower-emphasis or unavailable UI while preserving the component structure.',
      guidance:
        'Use opacity utilities for lightweight visual states while preserving semantic disabled behavior where needed.',
      samples: ['opacity-muted', 'opacity-disabled'],
      usedClasses: ['opacity-muted', 'opacity-disabled'],
      useWhen: [
        'Reducing emphasis for supporting text, metadata, or unavailable rows.',
      ],
      avoidWhen: [
        'Opacity is the only disabled signal; keep semantic disabled attributes where controls are unavailable.',
      ],
      classes: [
        { name: 'opacity-muted', description: 'Applies the muted opacity token.' },
        { name: 'opacity-disabled', description: 'Applies the disabled opacity token.' },
      ],
      snippet: `import { Component } from '@angular/core';

@Component({
  selector: 'app-state-utilities-example',
  template: \`
    <div class="d-flex gap-12">
      <span class="opacity-muted">Muted metadata</span>
      <button class="btn btn-outline opacity-disabled" type="button" disabled>Disabled</button>
    </div>
  \`,
})
export class StateUtilitiesExample {}`,
    },
  ];

  protected readonly selectedId = signal<UtilityDemo>('display');
  protected readonly drawerOpen = signal(false);
  protected readonly selectedGroup = computed(
    () => this.groups.find((group) => group.id === this.selectedId()) ?? this.groups[0],
  );

  protected openDetails(group: UtilityGroup): void {
    this.selectedId.set(group.id);
    this.drawerOpen.set(true);
  }

}
