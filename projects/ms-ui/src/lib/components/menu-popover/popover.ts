import { Component, contentChild, effect, input, model } from '@angular/core';

import type { AnchoredPlacement } from './anchored-placement';
import { PopoverPanelComponent } from './popover-panel';
import { PopoverTrigger } from './popover-trigger';

@Component({
  selector: 'ms-popover',
  templateUrl: './popover.html',
})
export class PopoverComponent {
  readonly open = model(false);
  readonly placement = input<AnchoredPlacement>('bottom-start');

  private readonly trigger = contentChild(PopoverTrigger);
  private readonly panel = contentChild(PopoverPanelComponent);

  constructor() {
    effect((onCleanup) => {
      const trigger = this.trigger();
      const panel = this.panel();

      if (!trigger || !panel) {
        return;
      }

      trigger.connectTo(panel.id);

      const toggleSubscription = panel.toggled.subscribe((isOpen) => {
        this.open.set(isOpen);
        trigger.setExpanded(isOpen);
      });
      const closeSubscription = panel.closeRequested.subscribe(() => {
        panel.hide();
        trigger.focus();
      });

      onCleanup(() => {
        toggleSubscription.unsubscribe();
        closeSubscription.unsubscribe();
      });
    });

    effect(() => {
      const trigger = this.trigger();
      const panel = this.panel();
      const shouldOpen = this.open();
      const placement = this.placement();

      if (!trigger || !panel) {
        return;
      }

      panel.setPlacement(placement);
      trigger.setExpanded(shouldOpen);

      if (shouldOpen) {
        panel.show(trigger.element);
      } else {
        panel.hide();
      }
    });
  }
}
