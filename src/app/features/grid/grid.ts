import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid {
  protected readonly columns = Array.from({ length: 12 }, (_, index) => index + 1);
}
