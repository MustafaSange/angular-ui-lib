import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

export type LayoutDirection = 'ltr' | 'rtl';

const DIRECTION_STORAGE_KEY = 'ms-direction';
const LAYOUT_DIRECTIONS: readonly LayoutDirection[] = ['ltr', 'rtl'];

@Service()
export class DirectionService {
  private readonly document = inject(DOCUMENT);
  private readonly storedDirection = this.readStoredDirection();

  readonly direction = signal<LayoutDirection>(this.storedDirection ?? 'ltr');

  constructor() {
    effect(() => {
      const direction = this.direction();

      this.document.documentElement.dir = direction;
      this.storeDirection(direction);
    });
  }

  setDirection(direction: LayoutDirection): void {
    this.direction.set(direction);
  }

  private readStoredDirection(): LayoutDirection | null {
    try {
      const storedDirection =
        this.document.defaultView?.localStorage.getItem(DIRECTION_STORAGE_KEY);

      return LAYOUT_DIRECTIONS.includes(storedDirection as LayoutDirection)
        ? (storedDirection as LayoutDirection)
        : null;
    } catch {
      return null;
    }
  }

  private storeDirection(direction: LayoutDirection): void {
    try {
      this.document.defaultView?.localStorage.setItem(DIRECTION_STORAGE_KEY, direction);
    } catch {
      // Direction switching still works when storage is unavailable.
    }
  }
}
