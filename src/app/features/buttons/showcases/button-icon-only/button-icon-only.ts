import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-button-icon-only-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-icon-only.html',
  styleUrl: './button-icon-only.scss',
  host: {
    class: 'button-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIconOnlyShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-button-example',
  template: \`
    <button class="btn btn-primary btn-icon" aria-label="Primary action">
      <span class="ms-icon" aria-hidden="true">add</span>
    </button>

    <button class="btn btn-outline btn-icon" aria-label="Add to favorites">
      <span class="ms-icon" aria-hidden="true">favorite</span>
    </button>
    <button class="btn btn-outline btn-icon" aria-label="Remove from favorites">
      <span class="ms-icon ms-icon-filled" aria-hidden="true">favorite</span>
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonExample {}`;
}
