import { Component, inject } from '@angular/core';

import { TranslatePipe } from '../../pipes';
import { ThemeMode, ThemeService } from '../../services';

@Component({
  selector: 'ms-theme-switcher',
  imports: [TranslatePipe],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcher {
  private readonly themeService = inject(ThemeService);

  protected readonly mode = this.themeService.mode;
  protected readonly options: readonly {
    labelKey: 'theme.light' | 'theme.dark' | 'theme.system';
    value: ThemeMode;
  }[] = [
    { labelKey: 'theme.light', value: 'light' },
    { labelKey: 'theme.dark', value: 'dark' },
    { labelKey: 'theme.system', value: 'system' },
  ];

  protected setMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);
  }
}
