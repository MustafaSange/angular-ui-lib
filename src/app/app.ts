import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeSwitcher } from './shared/components/theme-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('ui-lib');
}
