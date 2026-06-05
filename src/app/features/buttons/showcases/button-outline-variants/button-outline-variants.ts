import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-button-outline-variants-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-outline-variants.html',
  styleUrl: './button-outline-variants.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonOutlineVariantsShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-button-outline-example',
  template: \`
    <button class="btn btn-outline-primary">Primary outline</button>
    <button class="btn btn-outline-secondary">Secondary outline</button>
    <button class="btn btn-outline-danger">Danger outline</button>
    <button class="btn btn-outline-success">Success outline</button>
  \`,
})
export class ButtonOutlineExample {}`;
}
