import { Component, contentChild, effect, input, model } from '@angular/core';

import type { AnchoredPlacement } from './anchored-placement';
import { MenuPanelComponent } from './menu-panel';
import { MenuTrigger } from './menu-trigger';

@Component({
  selector: 'ms-menu',
  templateUrl: './menu.html',
})
export class MenuComponent {
  readonly open = model(false);
  readonly placement = input<AnchoredPlacement>('bottom-start');

  private readonly trigger = contentChild(MenuTrigger);
  private readonly panel = contentChild(MenuPanelComponent);

  constructor() {
    effect((onCleanup) => {
      const trigger = this.trigger();
      const panel = this.panel();

      if (!trigger || !panel) {
        return;
      }

      trigger.connectTo(panel.id);

      const toggleSubscription = panel.toggled.subscribe((isOpen) => {
        this.handleNativeToggle(isOpen);
      });
      const closeSubscription = panel.closeRequested.subscribe(() => {
        panel.hide();
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

  private handleNativeToggle(isOpen: boolean): void {
    this.open.set(isOpen);
    this.trigger()?.setExpanded(isOpen);

    if (isOpen) {
      this.panel()?.focusFirstEnabledItem();
    }
  }
}
