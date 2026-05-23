import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';

@Component({
  selector: 'app-button-links-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-links.html',
  styleUrl: './button-links.scss',
  host: {
    class: 'button-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLinksShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-button-links-example',
  template: \`
    <a href="#">Plain link</a>
    <a class="btn btn-primary" href="#">Primary link button</a>
    <a class="btn btn-outline" href="#">Outline link button</a>
    <a class="btn btn-ghost" href="#">Ghost link button</a>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLinksExample {}`;
}
