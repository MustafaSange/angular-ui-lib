import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';

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
    <button class="btn btn-outline-primary">Primary Outline</button>
    <button class="btn btn-outline-secondary">Secondary Outline</button>
    <button class="btn btn-outline-danger">Danger Outline</button>
    <button class="btn btn-outline-success">Success Outline</button>
  \`,
})
export class ButtonOutlineExample {}`;
}
