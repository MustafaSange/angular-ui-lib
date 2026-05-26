import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ShowcaseCode } from '../../../../shared/components/showcase-code';
import { SignalFormField } from '../../../../shared/components/signal-form-field';

@Component({
  selector: 'app-search-field-showcase',
  imports: [SignalFormField, ShowcaseCode],
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
  host: { class: 'showcase-pair' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldShowcase {
  protected readonly snippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SignalFormField } from './shared/components/signal-form-field';

@Component({
  selector: 'app-search-field-example',
  imports: [SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="search">Search</label>
      <span class="form-field-prefix" aria-hidden="true">
        <span class="ms-icon">search</span>
      </span>
      <input id="search" type="search" placeholder="Search projects" />
    </ms-signal-form-field>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldExample {}`;
}
