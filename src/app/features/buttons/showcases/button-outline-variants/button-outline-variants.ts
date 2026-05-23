import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-button-outline-variants-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-outline-variants.html',
  styleUrl: './button-outline-variants.scss',
  host: {
    class: 'button-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonOutlineVariantsShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-button-outline-example',
  template: \`
    <button class="btn btn-outline-primary">Primary outline</button>
    <button class="btn btn-outline-secondary">Secondary outline</button>
    <button class="btn btn-outline-danger">Danger outline</button>
    <button class="btn btn-outline-success">Success outline</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonOutlineExample {}`;
}
