import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-button-full-width-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-full-width.html',
  styleUrl: './button-full-width.scss',
  host: {
    class: 'button-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonFullWidthShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-full-width-button-example',
  template: \`
    <button class="btn btn-primary btn-full">Full width button</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullWidthButtonExample {}`;
}
