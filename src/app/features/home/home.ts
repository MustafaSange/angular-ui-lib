import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ShowcaseItem {
  readonly description: string;
  readonly name: string;
  readonly path: string;
  readonly type: 'Components' | 'Layout' | 'Pipes' | 'Utilities';
}

const SHOWCASES: readonly ShowcaseItem[] = [
  {
    name: 'Accordion',
    type: 'Components',
    path: '/accordion',
    description: 'Disclosure groups with rich titles, disabled items, and keyboard navigation.',
  },
  {
    name: 'Autocomplete',
    type: 'Components',
    path: '/autocomplete',
    description: 'Search-backed option picking with async sources and multiple values.',
  },
  {
    name: 'Alerts and Toasts',
    type: 'Components',
    path: '/feedback',
    description: 'Inline messages, transient notifications, actions, and feedback kinds.',
  },
  {
    name: 'Badge',
    type: 'Components',
    path: '/badge',
    description: 'Compact status, count, dot, and icon metadata treatments.',
  },
  {
    name: 'Bottom Sheet',
    type: 'Components',
    path: '/bottom-sheet',
    description: 'Mobile-friendly action, form, and service-opened contextual overlays.',
  },
  {
    name: 'Breadcrumb',
    type: 'Components',
    path: '/breadcrumb',
    description: 'Location trails with native links, current-page state, and RTL-safe separators.',
  },
  {
    name: 'Buttons',
    type: 'Components',
    path: '/buttons',
    description: 'Variants, sizes, states, and icon-only controls.',
  },
  {
    name: 'Button Toggle',
    type: 'Components',
    path: '/button-toggle',
    description: 'Single-select segmented button groups with projected native controls.',
  },
  {
    name: 'Card',
    type: 'Components',
    path: '/card',
    description: 'Semantic containers with media, actions, and surface treatments.',
  },
  {
    name: 'Chip',
    type: 'Components',
    path: '/chip',
    description: 'Projected labels, selected states, removable tokens, and disabled chips.',
  },
  {
    name: 'Checkbox',
    type: 'Components',
    path: '/checkbox',
    description: 'Projected checkbox groups with hints, errors, disabled, and label-before states.',
  },
  {
    name: 'Clipboard Copy',
    type: 'Components',
    path: '/clipboard',
    description: 'Icon copy actions, reveal-on-hover rows, and reusable clipboard helpers.',
  },
  {
    name: 'Confirmation Dialog',
    type: 'Components',
    path: '/confirm-dialog',
    description: 'Service-opened yes-or-no dialogs with semantic intent and boolean results.',
  },
  {
    name: 'Form Fields',
    type: 'Components',
    path: '/form-fields',
    description: 'Labels, native controls, support text, and field states.',
  },
  {
    name: 'File Upload',
    type: 'Components',
    path: '/file-upload',
    description: 'Signal-form file picking with drag and drop, validation, and safe names.',
  },
  {
    name: 'Format JSON',
    type: 'Pipes',
    path: '/format-json',
    description: 'Readable JSON strings and structured values with safe pass-through behavior.',
  },
  {
    name: 'Grid System',
    type: 'Layout',
    path: '/grid',
    description: 'Columns, responsive spans, row gaps, and containers.',
  },
  {
    name: 'Menu and Popover',
    type: 'Components',
    path: '/menu-popover',
    description: 'Anchored action menus and floating content using native platform APIs.',
  },
  {
    name: 'Modal System',
    type: 'Components',
    path: '/modal',
    description: 'Dynamic dialogs, typed results, stacked overlays, and focus behavior.',
  },
  {
    name: 'OTP Input',
    type: 'Components',
    path: '/otp-input',
    description: 'Configurable one-time-code fields with paste handling and completion events.',
  },
  {
    name: 'Media Slider',
    type: 'Components',
    path: '/media-slider',
    description: 'Native snap scrolling for photos, projected media, controls, and captions.',
  },
  {
    name: 'Navigation Drawer',
    type: 'Components',
    path: '/drawer',
    description: 'Button-controlled slide navigation with logical LTR and RTL placement.',
  },
  {
    name: 'Interface Density',
    type: 'Utilities',
    path: '/density',
    description: 'Global default and compact control sizing with local subtree overrides.',
  },
  {
    name: 'Date and Time Pickers',
    type: 'Components',
    path: '/date-time-pickers',
    description:
      'Manual and popup selection for canonical dates, times, and composed local values.',
  },
  {
    name: 'Pagination',
    type: 'Components',
    path: '/pagination',
    description: 'Controlled page navigation with ranges, ellipses, and disabled states.',
  },
  {
    name: 'Progress Indicator and Spinner',
    type: 'Components',
    path: '/progress',
    description: 'Determinate task completion and accessible indeterminate loading feedback.',
  },
  {
    name: 'Radio',
    type: 'Components',
    path: '/radio',
    description:
      'Projected radio groups with hints, errors, disabled, and label placement variants.',
  },
  {
    name: 'Side Navigation Menu',
    type: 'Components',
    path: '/side-nav',
    description: 'Icon rail navigation with expandable groups, flyouts, and current states.',
  },
  {
    name: 'Select',
    type: 'Components',
    path: '/select',
    description: 'Searchable single and multiple value pickers with async source support.',
  },
  {
    name: 'Search Query Form',
    type: 'Components',
    path: '/search-query-form',
    description: 'Config-driven backend search filters with required rows and typed values.',
  },
  {
    name: 'Slider',
    type: 'Components',
    path: '/slider',
    description: 'Native range controls with value binding, disabled state, and RTL-safe fill.',
  },
  {
    name: 'Stepper',
    type: 'Components',
    path: '/stepper',
    description: 'Horizontal and vertical multi-step workflows with optional linear progression.',
  },
  {
    name: 'Switch',
    type: 'Components',
    path: '/switch',
    description: 'Projected binary preference controls with hint, error, and disabled states.',
  },
  {
    name: 'Tables',
    type: 'Components',
    path: '/tables',
    description: 'Native table styling with density, responsive overflow, and data states.',
  },
  {
    name: 'Table Search',
    type: 'Components',
    path: '/table-search',
    description: 'Typed column filters and ordered multi-sort popovers for native table headers.',
  },
  {
    name: 'Tabs',
    type: 'Components',
    path: '/tabs',
    description: 'Projected panels with simple labels, rich titles, and keyboard navigation.',
  },
  {
    name: 'Timeline',
    type: 'Components',
    path: '/timeline',
    description: 'Connected workflow markers with statuses, projected content, and neutral rails.',
  },
  {
    name: 'Tree View',
    type: 'Components',
    path: '/tree',
    description:
      'Hierarchical navigation with projected content, lazy children, and keyboard focus.',
  },
  {
    name: 'Time Ago',
    type: 'Pipes',
    path: '/time-ago',
    description: 'Static and live locale-aware relative dates for past and future timestamps.',
  },
  {
    name: 'Tooltip',
    type: 'Components',
    path: '/tooltip',
    description: 'Native anchored hints for brief descriptions and contextual guidance.',
  },
  {
    name: 'Utilities',
    type: 'Utilities',
    path: '/utilities',
    description: 'Layout, spacing, typography, color, surface, and state helper classes.',
  },
];

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly searchQuery = signal('');

  protected readonly filteredShowcases = computed(() => {
    const query = this.searchQuery().trim().toLocaleLowerCase();

    if (!query) {
      return SHOWCASES;
    }

    return SHOWCASES.filter(({ description, name, type }) =>
      `${name} ${type} ${description}`.toLocaleLowerCase().includes(query),
    );
  });

  protected readonly resultSummary = computed(() => {
    const count = this.filteredShowcases().length;
    return `${count} ${count === 1 ? 'showcase' : 'showcases'} found`;
  });

  protected updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected clearSearch(input: HTMLInputElement): void {
    this.searchQuery.set('');
    input.focus();
  }
}
