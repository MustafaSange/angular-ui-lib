import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-button-icon-sizes-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-icon-sizes.html',
  styleUrl: './button-icon-sizes.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonIconSizesShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-button-sizes-example',
  template: \`
    <button class="btn btn-primary btn-icon btn-xs" aria-label="Add extra small">
      <span class="ms-icon" aria-hidden="true">add</span>
    </button>
    <button class="btn btn-primary btn-icon btn-sm" aria-label="Add small">
      <span class="ms-icon" aria-hidden="true">add</span>
    </button>
    <button class="btn btn-primary btn-icon" aria-label="Add medium">
      <span class="ms-icon" aria-hidden="true">add</span>
    </button>
    <button class="btn btn-primary btn-icon btn-lg" aria-label="Add large">
      <span class="ms-icon" aria-hidden="true">add</span>
    </button>
  \`,
})
export class IconButtonSizesExample {}`;
}
