import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';
import { DensityDirective } from '../../shared/ui-lib';

@Component({
  selector: 'app-density',
  imports: [RouterLink, ShowcaseCode, DensityDirective],
  templateUrl: './density.html',
  styleUrl: './density.scss',
})
export class Density {
  protected readonly localOverrideSnippet = `import { Component } from '@angular/core';

import { DensityDirective } from './shared/ui-lib';

@Component({
  selector: 'app-density-example',
  imports: [DensityDirective],
  template: \`
    <section msDensity="compact">
      <label class="form-field">
        <span class="form-field-label">Project name</span>
        <span class="form-field-control">
          <input type="text" placeholder="Operations dashboard" />
        </span>
      </label>

      <button class="btn btn-primary" type="button">Save project</button>
    </section>
  \`,
})
export class DensityExample {}`;
}
