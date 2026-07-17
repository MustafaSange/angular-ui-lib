import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-button-full-width-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-full-width.html',
  styleUrl: './button-full-width.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonFullWidthShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-full-width-button-example',
  template: \`
    <button class="btn btn-primary btn-full">Full Width Button</button>
  \`,
})
export class FullWidthButtonExample {}`;
}
