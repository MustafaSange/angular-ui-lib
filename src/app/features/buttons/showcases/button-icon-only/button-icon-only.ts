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
      <span aria-hidden="true">+</span>
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonExample {}`;
}
