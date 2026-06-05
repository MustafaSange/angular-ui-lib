import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  MediaCaptionDirective,
  MediaSlideComponent,
  MediaSliderComponent,
} from '../../shared/ui-lib/components/media-slider';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

@Component({
  selector: 'app-media-slider',
  imports: [
    RouterLink,
    MediaSliderComponent,
    MediaSlideComponent,
    MediaCaptionDirective,
    ShowcaseCode,
  ],
  templateUrl: './media-slider.html',
  styleUrl: './media-slider.scss',
})
export class MediaSlider {
  protected readonly basicSnippet = `import { Component } from '@angular/core';

import { MediaSlideComponent, MediaSliderComponent } from './shared/ui-lib';

@Component({
  selector: 'app-basic-media-slider-example', imports: [MediaSliderComponent, MediaSlideComponent], template: \`
    <ms-media-slider aria-label="Featured photos">
      <ms-media-slide>
        <img src="/assets/media-slider/coast.jpg" alt="Rocky coast at sunrise" />
      </ms-media-slide>

      <ms-media-slide>
        <img src="/assets/media-slider/city.jpg" alt="City street at dusk" />
      </ms-media-slide>

      <ms-media-slide>
        <img src="/assets/media-slider/studio.jpg" alt="Studio desk with product sketches" />
      </ms-media-slide>
    </ms-media-slider>
  \`, })
export class BasicMediaSliderExample {}`;

  protected readonly fullPageSnippet = `import { Component } from '@angular/core';

import { MediaCaptionDirective, MediaSlideComponent, MediaSliderComponent, } from './shared/ui-lib';

@Component({
  selector: 'app-large-media-slider-example', imports: [MediaSliderComponent, MediaSlideComponent, MediaCaptionDirective], template: \`
    <ms-media-slider
      slideSize="90%"
      aria-label="Large feature slides"
    >
      <ms-media-slide>
        <div class="feature-frame">Launch story</div>
        <p msMediaCaption>Each slide takes 90% of the slider track.</p>
      </ms-media-slide>

      <ms-media-slide>
        <div class="feature-frame">Product detail</div>
        <p msMediaCaption>Center snapping keeps one large slide in focus.</p>
      </ms-media-slide>

      <ms-media-slide>
        <div class="feature-frame">Editorial crop</div>
      </ms-media-slide>
    </ms-media-slider>
  \`, styles: [\`
    .feature-frame {
      display: grid;
      min-block-size: min(34rem, 62vh);
      place-items: center;
      background: var(--color-surface-muted);
      color: var(--color-text-primary);
      font-weight: var(--font-weight-semibold);
    }
  \`], })
export class LargeMediaSliderExample {}`;

  protected readonly aspectRatioSnippet = `import { Component } from '@angular/core';

import { MediaSlideComponent, MediaSliderComponent } from './shared/ui-lib';

@Component({
  selector: 'app-aspect-ratio-media-slider-example', imports: [MediaSliderComponent, MediaSlideComponent], template: \`
    <ms-media-slider
      aspectRatio="16 / 9"
      aria-label="Widescreen media"
    >
      <ms-media-slide>
        <div class="media-frame">16:9</div>
      </ms-media-slide>

      <ms-media-slide>
        <div class="media-frame">Widescreen</div>
      </ms-media-slide>
    </ms-media-slider>

    <ms-media-slider
      aspectRatio="9 / 16"
      slideSize="min(72vw, 16rem)"
      aria-label="Portrait media"
    >
      <ms-media-slide>
        <div class="media-frame">9:16</div>
      </ms-media-slide>

      <ms-media-slide>
        <div class="media-frame">Portrait</div>
      </ms-media-slide>
    </ms-media-slider>
  \`, styles: [\`
    ms-media-slider + ms-media-slider {
      display: block;
      margin-block-start: 1rem;
    }

    .media-frame {
      display: grid;
      place-items: center;
      background: var(--color-surface-muted);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-semibold);
    }
  \`], })
export class AspectRatioMediaSliderExample {}`;

  protected readonly captionSnippet = `import { Component } from '@angular/core';

import { MediaCaptionDirective, MediaSlideComponent, MediaSliderComponent, } from './shared/ui-lib';

@Component({
  selector: 'app-caption-media-slider-example', imports: [MediaSliderComponent, MediaSlideComponent, MediaCaptionDirective], template: \`
    <ms-media-slider aria-label="Gallery with captions">
      <ms-media-slide>
        <img src="/assets/media-slider/market.jpg" alt="Open-air market tables" />
        <p msMediaCaption>Morning market, natural light, editorial crop.</p>
      </ms-media-slide>

      <ms-media-slide>
        <img src="/assets/media-slider/interior.jpg" alt="Warm modern interior" />
      </ms-media-slide>

      <ms-media-slide>
        <img src="/assets/media-slider/trail.jpg" alt="Trail crossing a green hillside" />
        <p msMediaCaption>Trail study for outdoor campaign imagery.</p>
      </ms-media-slide>
    </ms-media-slider>
  \`, })
export class CaptionMediaSliderExample {}`;

  protected readonly alignmentSnippet = `import { Component } from '@angular/core';

import { MediaSlideComponent, MediaSliderComponent } from './shared/ui-lib';

@Component({
  selector: 'app-aligned-media-slider-example', imports: [MediaSliderComponent, MediaSlideComponent], template: \`
    <ms-media-slider snapAlign="start" aria-label="Start aligned photos">
      <ms-media-slide>
        <div class="media-tile">Start</div>
      </ms-media-slide>
      <ms-media-slide>
        <div class="media-tile">Middle</div>
      </ms-media-slide>
      <ms-media-slide>
        <div class="media-tile">End</div>
      </ms-media-slide>
    </ms-media-slider>

    <ms-media-slider snapAlign="end" aria-label="End aligned photos">
      <ms-media-slide>
        <div class="media-tile">Start</div>
      </ms-media-slide>
      <ms-media-slide>
        <div class="media-tile">Middle</div>
      </ms-media-slide>
      <ms-media-slide>
        <div class="media-tile">End</div>
      </ms-media-slide>
    </ms-media-slider>
  \`, styles: [\`
    ms-media-slider + ms-media-slider {
      display: block;
      margin-block-start: 1rem;
    }

    .media-tile {
      display: grid;
      place-items: center;
      aspect-ratio: 4 / 3;
      background: var(--color-surface-muted);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-semibold);
    }
  \`], })
export class AlignedMediaSliderExample {}`;

  protected readonly mixedSnippet = `import { Component } from '@angular/core';

import { CardComponent, CardContentDirective, CardHeaderDirective, CardTitleDirective, MediaCaptionDirective, MediaSlideComponent, MediaSliderComponent, } from './shared/ui-lib';

@Component({
  selector: 'app-mixed-media-slider-example', imports: [
    MediaSliderComponent, MediaSlideComponent, MediaCaptionDirective, CardComponent, CardHeaderDirective, CardTitleDirective, CardContentDirective, ], template: \`
    <ms-media-slider aria-label="Mixed media cards">
      <ms-media-slide>
        <ms-card>
          <header msCardHeader>
            <h2 msCardTitle>Campaign frame</h2>
          </header>
          <section msCardContent>
            <p>Use any projected content as a snapped slide.</p>
          </section>
        </ms-card>
        <p msMediaCaption>Projected card content.</p>
      </ms-media-slide>

      <ms-media-slide>
        <div class="media-panel">Video preview</div>
      </ms-media-slide>

      <ms-media-slide>
        <div class="media-panel">Product crop</div>
        <p msMediaCaption>Caption text stays optional per slide.</p>
      </ms-media-slide>
    </ms-media-slider>
  \`, styles: [\`
    .media-panel {
      display: grid;
      place-items: center;
      aspect-ratio: 4 / 3;
      background: var(--color-surface-muted);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-semibold);
    }
  \`], })
export class MixedMediaSliderExample {}`;

  protected readonly rtlSnippet = `import { Component } from '@angular/core';

import {
  MediaCaptionDirective,
  MediaSlideComponent,
  MediaSliderComponent,
} from './shared/ui-lib';

@Component({
  selector: 'app-rtl-media-slider-example',
  imports: [MediaSliderComponent, MediaSlideComponent, MediaCaptionDirective],
  template: \`
    <div dir="rtl">
      <ms-media-slider aria-label="معرض الصور">
        <ms-media-slide>
          <div class="media-tile">الأول</div>
          <p msMediaCaption>تعليق اختياري أسفل الشريحة.</p>
        </ms-media-slide>

        <ms-media-slide>
          <div class="media-tile">الثاني</div>
        </ms-media-slide>

        <ms-media-slide>
          <div class="media-tile">الثالث</div>
        </ms-media-slide>
      </ms-media-slider>
    </div>
  \`,
  styles: [\`
    .media-tile {
      display: grid;
      place-items: center;
      aspect-ratio: 4 / 3;
      background: var(--color-surface-muted);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-semibold);
    }
  \`],
})
export class RtlMediaSliderExample {}`;
}
