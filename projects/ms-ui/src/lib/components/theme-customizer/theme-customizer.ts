import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';

import { TranslatePipe } from '../../pipes';
import { LanguageService, type TranslationKey } from '../../services/language';
import { THEME_SEMANTIC_COLORS, ThemeSemanticColor, ThemeService } from '../../services';

@Component({
  selector: 'ms-theme-customizer',
  imports: [TranslatePipe],
  templateUrl: './theme-customizer.html',
  styleUrl: './theme-customizer.scss',
})
export class ThemeCustomizer {
  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  protected readonly options = THEME_SEMANTIC_COLORS;
  protected readonly colorCustomizations = this.themeService.colorCustomizations;
  protected readonly defaultColors = signal<Partial<Record<ThemeSemanticColor, string>>>({});
  protected readonly hasCustomizations = computed(
    () => Object.keys(this.colorCustomizations()).length > 0,
  );

  constructor() {
    afterNextRender(() => {
      this.defaultColors.set(this.readDefaultColors());
    });
  }

  protected colorValue(color: ThemeSemanticColor): string {
    return this.colorCustomizations()[color] ?? this.defaultColors()[color] ?? '#000000';
  }

  protected isCustomized(color: ThemeSemanticColor): boolean {
    return Boolean(this.colorCustomizations()[color]);
  }

  protected setColor(color: ThemeSemanticColor, event: Event): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    this.themeService.setColor(color, input.value);
  }

  protected resetColor(color: ThemeSemanticColor): void {
    this.themeService.resetColor(color);
  }

  protected resetColors(): void {
    this.themeService.resetColors();
  }

  protected colorLabel(color: ThemeSemanticColor): string {
    return this.languageService.translate(`theme.${color}` as TranslationKey);
  }

  private readDefaultColors(): Partial<Record<ThemeSemanticColor, string>> {
    const styles = this.document.defaultView?.getComputedStyle(this.document.documentElement);

    if (!styles) {
      return {};
    }

    return this.options.reduce<Partial<Record<ThemeSemanticColor, string>>>((colors, option) => {
      const value = styles.getPropertyValue(`--color-${option.value}-base`).trim();

      return value ? { ...colors, [option.value]: value } : colors;
    }, {});
  }
}
