import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-button-variants-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-variants.html',
  styleUrl: './button-variants.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonVariantsShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-button-variants-example',
  template: \`
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-outline">Outline</button>
    <button class="btn btn-ghost">Ghost</button>
    <button class="btn btn-danger">Danger</button>
    <button class="btn btn-success">Success</button>
  \`,
})
export class ButtonVariantsExample {}`;
}
