import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-button-links-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-links.html',
  styleUrl: './button-links.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonLinksShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-button-links-example',
  template: \`
    <a href="#">Plain link</a>
    <a class="btn btn-primary" href="#">Primary Link Button</a>
    <a class="btn btn-outline" href="#">Outline Link Button</a>
    <a class="btn btn-ghost" href="#">Ghost Link Button</a>
  \`,
})
export class ButtonLinksExample {}`;
}
