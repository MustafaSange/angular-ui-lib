import { Component, computed, input, model, signal } from '@angular/core';

let nextSideNavId = 0;

@Component({
  selector: 'ms-side-nav',
  templateUrl: './side-nav.html',
  host: {
    class: 'side-nav',
    role: 'navigation',
    '[attr.id]': 'id',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.data-collapsed]': 'collapsed()',
    '[class.side-nav-collapsed]': 'collapsed()',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class SideNavComponent {
  readonly collapsed = model(false);
  readonly hoverExpand = input(true);
  readonly closeOnNavigate = input(false);
  readonly ariaLabel = input<string | null>(null, {
    alias: 'aria-label',
  });
  readonly ariaLabelledby = input<string | null>(null, {
    alias: 'aria-labelledby',
  });

  readonly id = `side-nav-${nextSideNavId++}`;
  readonly closeRequests = signal(0);

  protected readonly listId = `${this.id}-list`;
  protected readonly hoverExpansion = computed(() => this.collapsed() && this.hoverExpand());

  toggleCollapsed(): void {
    this.collapsed.update((isCollapsed) => !isCollapsed);
  }

  requestNavigationClose(): void {
    if (this.closeOnNavigate()) {
      this.closeRequests.update((count) => count + 1);
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    this.closeRequests.update((count) => count + 1);
  }
}
