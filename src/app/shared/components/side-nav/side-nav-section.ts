import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

import { SideNavComponent } from './side-nav';

let nextSideNavSectionId = 0;

@Component({
  selector: 'ms-side-nav-section',
  templateUrl: './side-nav-section.html',
  host: {
    class: 'side-nav-section',
    '[attr.data-depth]': 'depth',
    '[attr.data-expanded]': 'isOpen()',
    '[class.side-nav-section-active]': 'active()',
    '[class.side-nav-section-open]': 'isOpen()',
    '(mouseenter)': 'openTransient()',
    '(focusin)': 'openTransient()',
    '(mouseleave)': 'scheduleCloseTransient()',
    '(keydown)': 'handleKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavSectionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sideNav = inject(SideNavComponent);
  private readonly parentSection = inject(SideNavSectionComponent, {
    optional: true,
    skipSelf: true,
  });
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly transientOpen = signal(false);
  private closeTimeoutId: ReturnType<typeof setTimeout> | undefined;

  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly expanded = model(false);
  readonly active = input(false);

  readonly sectionId = `side-nav-section-${nextSideNavSectionId++}`;
  readonly panelId = `${this.sectionId}-panel`;
  readonly depth: number = this.parentSection ? this.parentSection.depth + 1 : 0;

  protected readonly opensAsFlyout = computed(() => this.sideNav.collapsed() || this.depth > 0);
  protected readonly isOpen = computed(() => this.expanded() || this.transientOpen());

  constructor() {
    effect(() => {
      this.sideNav.closeRequests();
      this.transientOpen.set(false);

      if (this.opensAsFlyout()) {
        this.expanded.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearCloseTimeout();
    });
  }

  protected toggle(event: MouseEvent): void {
    const trigger = event.currentTarget;

    if (trigger instanceof HTMLButtonElement && trigger.disabled) {
      return;
    }

    if (this.opensAsFlyout()) {
      this.transientOpen.update((isOpen) => !isOpen);
      return;
    }

    this.expanded.update((isExpanded) => !isExpanded);
  }

  protected openTransient(): void {
    this.clearCloseTimeout();

    if (this.sideNav.hoverExpand() && this.opensAsFlyout()) {
      this.transientOpen.set(true);
    }
  }

  protected closeTransient(): void {
    this.clearCloseTimeout();

    if (this.opensAsFlyout()) {
      this.transientOpen.set(false);
    }
  }

  protected scheduleCloseTransient(): void {
    this.clearCloseTimeout();

    if (!this.opensAsFlyout()) {
      return;
    }

    this.closeTimeoutId = setTimeout(() => {
      this.transientOpen.set(false);
      this.closeTimeoutId = undefined;
    }, 120);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.isOpen()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.transientOpen.set(false);

    if (this.opensAsFlyout()) {
      this.expanded.set(false);
    }

    this.triggerRef()?.nativeElement.focus();
  }

  private clearCloseTimeout(): void {
    if (!this.closeTimeoutId) {
      return;
    }

    clearTimeout(this.closeTimeoutId);
    this.closeTimeoutId = undefined;
  }
}
