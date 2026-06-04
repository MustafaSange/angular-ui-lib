import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-button-states-showcase',
  imports: [ShowcaseCode],
  templateUrl: './button-states.html',
  styleUrl: './button-states.scss',
  host: {
    class: 'button-section',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonStatesShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-button-states-example',
  template: \`
    <button class="btn btn-primary" disabled>Primary disabled</button>
    <button class="btn btn-secondary" disabled>Secondary disabled</button>
    <button class="btn btn-outline" disabled>Outline disabled</button>
    <button class="btn btn-ghost" disabled>Ghost disabled</button>
    <button class="btn btn-danger" disabled>Danger disabled</button>
    <button class="btn btn-success" disabled>Success disabled</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonStatesExample {}`;
}
