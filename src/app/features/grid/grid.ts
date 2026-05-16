import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-grid',
  imports: [RouterLink],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid {
  protected readonly columns = Array.from({ length: 12 }, (_, index) => index + 1);
}
