import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastOutletComponent } from './shared/ui-lib/components/feedback';
import { BottomSheetOutletComponent } from './shared/ui-lib/components/bottom-sheet';
import { DirectionSwitcher } from './shared/ui-lib/components/direction-switcher';
import { ModalOutletComponent } from './shared/ui-lib/components/modal';
import { ThemeCustomizer } from './shared/ui-lib/components/theme-customizer';
import { ThemeSwitcher } from './shared/ui-lib/components/theme-switcher';
import { DensityService, type UiDensity } from './shared/ui-lib/services';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DirectionSwitcher,
    ThemeCustomizer,
    ThemeSwitcher,
    BottomSheetOutletComponent,
    ModalOutletComponent,
    ToastOutletComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly densityService = inject(DensityService);

  protected readonly title = signal('ui-lib');
  protected readonly density = this.densityService.density;

  protected setDensity(density: UiDensity): void {
    this.densityService.setDensity(density);
  }
}
