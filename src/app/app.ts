import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastOutletComponent } from './shared/components/feedback';
import { BottomSheetOutletComponent } from './shared/components/bottom-sheet';
import { DirectionSwitcher } from './shared/components/direction-switcher';
import { ModalOutletComponent } from './shared/components/modal';
import { ThemeSwitcher } from './shared/components/theme-switcher';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    DirectionSwitcher,
    ThemeSwitcher,
    BottomSheetOutletComponent,
    ModalOutletComponent,
    ToastOutletComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('ui-lib');
}
