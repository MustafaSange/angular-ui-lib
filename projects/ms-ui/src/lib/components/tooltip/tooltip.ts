import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, contentChild, effect, inject, input } from '@angular/core';

import { TooltipPanelComponent } from './tooltip-panel';
import type { TooltipPlacement } from './tooltip-placement';
import { TooltipTrigger } from './tooltip-trigger';

const POINTER_OPEN_DELAY = 500;
const CLOSE_DELAY = 100;

let activeTooltip: TooltipComponent | undefined;

@Component({
  selector: 'ms-tooltip',
  templateUrl: './tooltip.html',
})
export class TooltipComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly trigger = contentChild(TooltipTrigger);
  private readonly panel = contentChild(TooltipPanelComponent);
  private openTimer: ReturnType<typeof setTimeout> | undefined;
  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  private keydownListener: ((event: KeyboardEvent) => void) | undefined;
  private pointerOverTrigger = false;
  private pointerOverPanel = false;
  private triggerFocused = false;
  private dismissedUntilTriggerIdle = false;

  readonly placement = input<TooltipPlacement>('top');

  constructor() {
    effect((onCleanup) => {
      const trigger = this.trigger();
      const panel = this.panel();

      if (!trigger || !panel) {
        return;
      }

      trigger.connectTo(panel.id);

      const subscriptions = [
        trigger.pointerEntered.subscribe(() => this.handleTriggerPointerEnter()),
        trigger.pointerLeft.subscribe(() => this.handleTriggerPointerLeave()),
        trigger.focused.subscribe(() => this.handleTriggerFocus()),
        trigger.blurred.subscribe(() => this.handleTriggerBlur()),
        panel.pointerEntered.subscribe(() => this.handlePanelPointerEnter()),
        panel.pointerLeft.subscribe(() => this.handlePanelPointerLeave()),
        panel.toggled.subscribe((isOpen) => this.handleNativeToggle(isOpen)),
      ];

      onCleanup(() => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.clearTimers();
        panel.hide();
        this.releaseActiveTooltip();
      });
    });

    effect(() => {
      this.panel()?.setPlacement(this.placement());
    });
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private handleTriggerPointerEnter(): void {
    this.pointerOverTrigger = true;
    this.clearCloseTimer();

    if (this.dismissedUntilTriggerIdle || this.panel()?.isOpen() || this.openTimer) {
      return;
    }

    this.openTimer = setTimeout(() => {
      this.openTimer = undefined;
      this.show();
    }, POINTER_OPEN_DELAY);
  }

  private handleTriggerPointerLeave(): void {
    this.pointerOverTrigger = false;
    this.clearOpenTimer();
    this.resetDismissedStateWhenIdle();
    this.scheduleClose();
  }

  private handleTriggerFocus(): void {
    this.triggerFocused = true;
    this.clearTimers();

    if (!this.dismissedUntilTriggerIdle) {
      this.show();
    }
  }

  private handleTriggerBlur(): void {
    this.triggerFocused = false;
    this.resetDismissedStateWhenIdle();
    this.scheduleClose();
  }

  private handlePanelPointerEnter(): void {
    this.pointerOverPanel = true;
    this.clearCloseTimer();
  }

  private handlePanelPointerLeave(): void {
    this.pointerOverPanel = false;
    this.scheduleClose();
  }

  private handleNativeToggle(isOpen: boolean): void {
    if (!isOpen) {
      this.clearCloseTimer();
      this.releaseActiveTooltip();
    }
  }

  private show(): void {
    const trigger = this.trigger();
    const panel = this.panel();

    if (!trigger || !panel || this.dismissedUntilTriggerIdle) {
      return;
    }

    if (activeTooltip !== this) {
      activeTooltip?.hide();
      activeTooltip = this;
    }

    panel.show(trigger.element);
    this.ensureKeydownListener();
  }

  private scheduleClose(): void {
    if (this.pointerOverTrigger || this.pointerOverPanel || this.triggerFocused) {
      return;
    }

    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.closeTimer = undefined;
      this.hide();
    }, CLOSE_DELAY);
  }

  private hide(): void {
    this.clearTimers();
    this.panel()?.hide();
    this.releaseActiveTooltip();
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.panel()?.isOpen()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.dismissedUntilTriggerIdle = this.pointerOverTrigger || this.triggerFocused;
    this.hide();
  }

  private resetDismissedStateWhenIdle(): void {
    if (!this.pointerOverTrigger && !this.triggerFocused) {
      this.dismissedUntilTriggerIdle = false;
    }
  }

  private ensureKeydownListener(): void {
    if (this.keydownListener) {
      return;
    }

    this.keydownListener = (event) => this.handleKeydown(event);
    this.document.addEventListener('keydown', this.keydownListener, true);
  }

  private removeKeydownListener(): void {
    if (!this.keydownListener) {
      return;
    }

    this.document.removeEventListener('keydown', this.keydownListener, true);
    this.keydownListener = undefined;
  }

  private releaseActiveTooltip(): void {
    if (activeTooltip === this) {
      activeTooltip = undefined;
    }

    this.removeKeydownListener();
  }

  private clearTimers(): void {
    this.clearOpenTimer();
    this.clearCloseTimer();
  }

  private clearOpenTimer(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = undefined;
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }
}
