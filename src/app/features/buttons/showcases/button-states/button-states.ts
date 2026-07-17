import { Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/showcase-code';

@Component({
  selector: 'app-button-states-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-states.html',
  styleUrl: './button-states.scss',
  host: {
    class: 'button-section',
  },
})
export class ButtonStatesShowcase {
  protected readonly snippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-button-states-example',
  template: \`
    <button class="btn btn-primary" disabled>Primary Disabled</button>
    <button class="btn btn-secondary" disabled>Secondary Disabled</button>
    <button class="btn btn-outline" disabled>Outline Disabled</button>
    <button class="btn btn-ghost" disabled>Ghost Disabled</button>
    <button class="btn btn-danger" disabled>Danger Disabled</button>
    <button class="btn btn-success" disabled>Success Disabled</button>
  \`,
})
export class ButtonStatesExample {}`;
}
