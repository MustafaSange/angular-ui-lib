export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeSemanticColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type ThemeColorCustomizations = Partial<Record<ThemeSemanticColor, string>>;

export interface ThemeColorOption {
  readonly label: string;
  readonly value: ThemeSemanticColor;
}

export const THEME_SEMANTIC_COLORS: readonly ThemeColorOption[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Accent', value: 'accent' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
  { label: 'Info', value: 'info' },
] as const;
