import type { SwitchKind, SwitchVariant } from './switch-types';

/** Application defaults; individual switch inputs override each option independently. */
export interface SwitchConfig {
  readonly variant?: SwitchVariant;
  /** Semantic selected-state palette. Explicit selected colors take precedence. */
  readonly kind?: SwitchKind;
  /** Any CSS color, including a theme variable such as `var(--color-accent)`. */
  readonly selectedTrackColor?: string;
  /** Any CSS color, including a theme variable such as `var(--color-accent-contrast)`. */
  readonly selectedThumbColor?: string;
}
