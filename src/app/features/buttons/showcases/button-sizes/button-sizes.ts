import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-button-sizes-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-sizes.html',
  styleUrl: './button-sizes.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonSizesShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-button-sizes-example',
  template: \`
    <button class="btn btn-primary btn-xs">Extra Small</button>
    <button class="btn btn-primary btn-sm">Small</button>
    <button class="btn btn-primary btn-md">Medium</button>
    <button class="btn btn-primary btn-lg">Large</button>
  \`,
})
export class ButtonSizesExample {}`;
}
