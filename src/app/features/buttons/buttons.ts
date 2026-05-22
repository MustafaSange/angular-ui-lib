import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/components/showcase-code';

@Component({
  selector: 'app-buttons',
  imports: [RouterLink, ShowcaseCode],
  templateUrl: './buttons.html',
  styleUrl: './buttons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Buttons {
  protected readonly snippets = {
    variants: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-button-variants-example',
  template: \`
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-outline">Outline</button>
    <button class="btn btn-ghost">Ghost</button>
    <button class="btn btn-danger">Danger</button>
    <button class="btn btn-success">Success</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonVariantsExample {}`,
    links: `import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class ButtonLinksExample {}`,
    outlineVariants: `import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class ButtonOutlineExample {}`,
    sizes: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-button-sizes-example',
  template: \`
    <button class="btn btn-primary btn-xs">Extra small</button>
    <button class="btn btn-primary btn-sm">Small</button>
    <button class="btn btn-primary btn-md">Medium</button>
    <button class="btn btn-primary btn-lg">Large</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonSizesExample {}`,
    states: `import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class ButtonStatesExample {}`,
    fullWidth: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-full-width-button-example',
  template: \`
    <button class="btn btn-primary btn-full">Full width button</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullWidthButtonExample {}`,
    iconOnly: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-button-example',
  template: \`
    <button class="btn btn-primary btn-icon" aria-label="Primary action">
      <span aria-hidden="true">+</span>
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonExample {}`,
    iconSizes: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-button-sizes-example',
  template: \`
    <button class="btn btn-primary btn-icon btn-xs" aria-label="Add extra small">
      <span aria-hidden="true">+</span>
    </button>
    <button class="btn btn-primary btn-icon btn-sm" aria-label="Add small">
      <span aria-hidden="true">+</span>
    </button>
    <button class="btn btn-primary btn-icon" aria-label="Add medium">
      <span aria-hidden="true">+</span>
    </button>
    <button class="btn btn-primary btn-icon btn-lg" aria-label="Add large">
      <span aria-hidden="true">+</span>
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonSizesExample {}`,
    disabledIcons: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-disabled-icon-button-example',
  template: \`
    <button class="btn btn-primary btn-icon" aria-label="Primary disabled" disabled>
      <span aria-hidden="true">+</span>
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisabledIconButtonExample {}`,
  };
}
