import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-button-disabled-icons-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-disabled-icons.html',
  styleUrl: './button-disabled-icons.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonDisabledIconsShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-disabled-icon-button-example',
  template: \`
    <button class="btn btn-primary btn-icon" aria-label="Primary disabled" disabled>
      <span class="ms-icon" aria-hidden="true">add</span>
    </button>
  \`,
})
export class DisabledIconButtonExample {}`;
}
