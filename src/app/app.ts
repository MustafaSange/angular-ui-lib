import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastOutletComponent } from './shared/ui-lib/components/feedback';
import { BottomSheetOutletComponent } from './shared/ui-lib/components/bottom-sheet';
import { DirectionSwitcher } from './shared/ui-lib/components/direction-switcher';
import { ModalOutletComponent } from './shared/ui-lib/components/modal';
import { ThemeCustomizer } from './shared/ui-lib/components/theme-customizer';
import { ThemeSwitcher } from './shared/ui-lib/components/theme-switcher';

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
  protected readonly title = signal('ui-lib');
}
