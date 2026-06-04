import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardMediaDirective,
  CardSubtitleDirective,
  CardTitleDirective,
} from '../../shared/ui-lib/components/card';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-card',
  imports: [
    RouterLink,
    CardComponent,
    CardHeaderDirective,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
    CardFooterDirective,
    CardMediaDirective,
    ShowcaseCode,
  ],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  protected readonly basicSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  CardHeaderDirective,
  CardSubtitleDirective,
  CardTitleDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-basic-card-example',
  imports: [
    CardComponent,
    CardHeaderDirective,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
  ],
  template: \`
    <ms-card>
      <header msCardHeader>
        <h2 msCardTitle>Quarterly planning</h2>
        <p msCardSubtitle>Shared team workspace</p>
      </header>

      <section msCardContent>
        <p>Review goals, owners, and deadlines before the next planning session.</p>
      </section>
    </ms-card>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicCardExample {}`;

  protected readonly appearanceSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  CardHeaderDirective,
  CardTitleDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-card-appearance-example',
  imports: [CardComponent, CardHeaderDirective, CardTitleDirective, CardContentDirective],
  template: \`
    <ms-card appearance="outlined">
      <header msCardHeader>
        <h2 msCardTitle>Outlined</h2>
      </header>
      <section msCardContent>
        <p>Default card treatment for ordinary content groups.</p>
      </section>
    </ms-card>

    <ms-card appearance="elevated">
      <header msCardHeader>
        <h2 msCardTitle>Elevated</h2>
      </header>
      <section msCardContent>
        <p>Raised treatment for surfaces that need a little more separation.</p>
      </section>
    </ms-card>

    <ms-card appearance="filled">
      <header msCardHeader>
        <h2 msCardTitle>Filled</h2>
      </header>
      <section msCardContent>
        <p>Muted treatment for grouped supporting information.</p>
      </section>
    </ms-card>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardAppearanceExample {}`;

  protected readonly mediaSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardMediaDirective,
  CardSubtitleDirective,
  CardTitleDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-card-media-example',
  imports: [
    CardComponent,
    CardMediaDirective,
    CardHeaderDirective,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
    CardFooterDirective,
  ],
  template: \`
    <ms-card>
      <div msCardMedia class="summary-media" aria-hidden="true"></div>

      <header msCardHeader>
        <h2 msCardTitle>Release summary</h2>
        <p msCardSubtitle>Version 2.4 readiness</p>
      </header>

      <section msCardContent>
        <p>Track launch checks, documentation updates, and stakeholder sign-off.</p>
      </section>

      <footer msCardFooter>
        <button class="btn btn-primary btn-sm" type="button">Review</button>
        <button class="btn btn-ghost btn-sm" type="button">Archive</button>
      </footer>
    </ms-card>
  \`,
  styles: [\`
    .summary-media {
      block-size: 8rem;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 24%, transparent), transparent 58%),
        linear-gradient(45deg, color-mix(in srgb, var(--color-success) 20%, transparent), transparent 62%),
        var(--color-surface-muted);
    }
  \`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardMediaExample {}`;

  protected readonly rtlSnippet = `import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardSubtitleDirective,
  CardTitleDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-card-rtl-example',
  imports: [
    CardComponent,
    CardHeaderDirective,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
    CardFooterDirective,
  ],
  template: \`
    <div dir="rtl">
      <ms-card>
        <header msCardHeader>
          <h2 msCardTitle>مراجعة المشروع</h2>
          <p msCardSubtitle>تحديث أسبوعي</p>
        </header>

        <section msCardContent>
          <p>تتبع الأولويات والمخاطر والخطوات التالية للفريق.</p>
        </section>

        <footer msCardFooter>
          <button class="btn btn-primary btn-sm" type="button">فتح</button>
          <button class="btn btn-ghost btn-sm" type="button">تأجيل</button>
        </footer>
      </ms-card>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardRtlExample {}`;
}
