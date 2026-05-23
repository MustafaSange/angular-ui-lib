import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-button-sizes-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-sizes.html',
  styleUrl: './button-sizes.scss',
  host: {
    class: 'button-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSizesShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-button-sizes-example',
  template: \`
    <button class="btn btn-primary btn-xs">Extra small</button>
    <button class="btn btn-primary btn-sm">Small</button>
    <button class="btn btn-primary btn-md">Medium</button>
    <button class="btn btn-primary btn-lg">Large</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSizesExample {}`;
}
