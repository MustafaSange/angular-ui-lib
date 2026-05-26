export type NativePopoverElement = HTMLElement & {
  showPopover(options?: { source?: HTMLButtonElement }): void;
};

export function isPopoverOpen(element: HTMLElement): boolean {
  return element.matches(':popover-open');
}

export function showAnchoredPopover(element: HTMLElement, trigger: HTMLButtonElement): void {
  (element as NativePopoverElement).showPopover({ source: trigger });
}
