import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-button-icon-sizes-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-icon-sizes.html',
  styleUrl: './button-icon-sizes.scss',
  host: {
    class: 'button-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonIconSizesShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-button-sizes-example',
  template: \`
    <button class="btn btn-primary btn-icon btn-xs" aria-label="Add extra small">
      <span aria-hidden="true">+</span>
    </button>
    <button class="btn btn-primary btn-icon btn-sm" aria-label="Add small">
      <span aria-hidden="true">+</span>
    </button>
    <button class="btn btn-primary btn-icon" aria-label="Add medium">
      <span aria-hidden="true">+</span>
    </button>
    <button class="btn btn-primary btn-icon btn-lg" aria-label="Add large">
      <span aria-hidden="true">+</span>
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonSizesExample {}`;
}
