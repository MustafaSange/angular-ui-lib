import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeMode, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'ms-theme-switcher',
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcher {
  private readonly themeService = inject(ThemeService);

  protected readonly mode = this.themeService.mode;
  protected readonly options: readonly { label: string; value: ThemeMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  protected setMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
  }
}
