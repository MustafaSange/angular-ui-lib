import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ChipComponent, ChipRemoveDirective } from '../../shared/ui-lib/components/chip';
import { ShowcaseCode } from '../../shared/showcase-code';

@Component({
  selector: 'app-chip',
  imports: [RouterLink, ChipComponent, ChipRemoveDirective, ShowcaseCode],
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
})
export class Chip {
  protected readonly removableChips = signal(['Angular', 'Signals', 'RTL']);

  protected readonly staticSnippet = `import { Component } from '@angular/core';

import { ChipComponent } from './shared/ui-lib';

@Component({
  selector: 'app-static-chip-example', imports: [ChipComponent], template: \`
    <ms-chip>Design system</ms-chip>
    <ms-chip kind="info">Documentation</ms-chip>
    <ms-chip kind="success">
      <span class="ms-icon" aria-hidden="true">check_circle</span>
      Published
    </ms-chip>
  \`, })
export class StaticChipExample {}`;

  protected readonly kindsSnippet = `import { Component } from '@angular/core';

import { ChipComponent } from './shared/ui-lib';

@Component({
  selector: 'app-chip-kinds-example', imports: [ChipComponent], template: \`
    <ms-chip>Neutral</ms-chip>
    <ms-chip kind="info">Info</ms-chip>
    <ms-chip kind="success">Success</ms-chip>
    <ms-chip kind="warning">Warning</ms-chip>
    <ms-chip kind="danger">Danger</ms-chip>
  \`, })
export class ChipKindsExample {}`;

  protected readonly statesSnippet = `import { Component } from '@angular/core';

import { ChipComponent } from './shared/ui-lib';

@Component({
  selector: 'app-chip-states-example', imports: [ChipComponent], template: \`
    <ms-chip kind="info" selected>Selected</ms-chip>
    <ms-chip kind="success" appearance="outline">Outline</ms-chip>
    <ms-chip kind="warning" disabled>Disabled</ms-chip>
  \`, })
export class ChipStatesExample {}`;

  protected readonly radiusSnippet = `import { Component } from '@angular/core';

import { ChipComponent } from './shared/ui-lib';

@Component({
  selector: 'app-chip-radius-example', imports: [ChipComponent], template: \`
    <ms-chip kind="success" radius="none">None</ms-chip>
    <ms-chip kind="success">Small</ms-chip>
    <ms-chip kind="success" radius="md">Medium</ms-chip>
    <ms-chip kind="success" radius="lg">Large</ms-chip>
    <ms-chip kind="success" radius="xl">Extra large</ms-chip>
    <ms-chip kind="success" radius="full">Full</ms-chip>
  \`, })
export class ChipRadiusExample {}`;

  protected readonly sizesSnippet = `import { Component } from '@angular/core';

import { ChipComponent, ChipRemoveDirective } from './shared/ui-lib';

@Component({
  selector: 'app-chip-sizes-example',
  imports: [ChipComponent, ChipRemoveDirective],
  template: \`
    <ms-chip>Small</ms-chip>
    <ms-chip size="xs">Extra small</ms-chip>
    <ms-chip size="xs" removable>
      Extra small removable
      <button type="button" msChipRemove aria-label="Remove extra small chip"></button>
    </ms-chip>
  \`,
})
export class ChipSizesExample {}`;

  protected readonly removableSnippet = `import { Component, signal } from '@angular/core';

import { ChipComponent, ChipRemoveDirective } from './shared/ui-lib';

@Component({
  selector: 'app-removable-chip-example', imports: [ChipComponent, ChipRemoveDirective], template: \`
    @for (chip of chips(); track chip) {
      <ms-chip removable (removed)="removeChip(chip)">
        {{ chip }}
        <button type="button" msChipRemove [attr.aria-label]="'Remove ' + chip"></button>
      </ms-chip>
    }

    <ms-chip removable disabled>
      Locked
      <button type="button" msChipRemove aria-label="Remove Locked"></button>
    </ms-chip>
  \`, })
export class RemovableChipExample {
  protected readonly chips = signal(['Angular', 'Signals', 'RTL']);

  protected removeChip(chip: string): void {
    this.chips.update((chips) => chips.filter((item) => item !== chip));
  }
}`;

  protected readonly rtlSnippet = `import { Component } from '@angular/core';

import { ChipComponent, ChipRemoveDirective } from './shared/ui-lib';

@Component({
  selector: 'app-chip-rtl-example',
  imports: [ChipComponent, ChipRemoveDirective],
  template: \`
    <div dir="rtl">
      <ms-chip kind="success">
        <span class="ms-icon" aria-hidden="true">check_circle</span>
        منشور
      </ms-chip>
      <ms-chip removable>
        تصميم
        <button type="button" msChipRemove aria-label="Remove تصميم"></button>
      </ms-chip>
    </div>
  \`,
})
export class ChipRtlExample {}`;

  protected removeChip(chip: string): void {
    this.removableChips.update((chips) => chips.filter((item) => item !== chip));
  }

  protected restoreChips(): void {
    this.removableChips.set(['Angular', 'Signals', 'RTL']);
  }
}
