import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { MediaSlideComponent } from './media-slide';
import type { MediaSliderScrollBehavior, MediaSliderSnapAlign } from './media-slider-types';

@Component({
  selector: 'ms-media-slider',
  templateUrl: './media-slider.html',
  host: {
    class: 'media-slider',
    '[class.media-slider-align-start]': "snapAlign() === 'start'",
    '[class.media-slider-align-center]': "snapAlign() === 'center'",
    '[class.media-slider-align-end]': "snapAlign() === 'end'",
    '[style.--_media-slider-snap-align]': 'snapAlign()',
    '[style.--_media-slider-scroll-behavior]': 'scrollBehavior()',
    '[style.--_media-slider-slide-size]': 'slideSize()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSliderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly track = viewChild<ElementRef<HTMLDivElement>>('track');
  private activeSlideFrame = 0;

  readonly slides = contentChildren(MediaSlideComponent);
  readonly snapAlign = input<MediaSliderSnapAlign, string | undefined>('center', {
    transform: coerceSnapAlign,
  });
  readonly scrollBehavior = input<MediaSliderScrollBehavior, string | undefined>('smooth', {
    transform: coerceScrollBehavior,
  });
  readonly slideSize = input<string, string | undefined>('min(78vw, 22rem)', {
    transform: coerceSlideSize,
  });
  readonly ariaLabel = input('Media slider', { alias: 'aria-label' });
  readonly previousLabel = input('Previous item');
  readonly nextLabel = input('Next item');

  protected readonly activeIndex = signal(0);
  protected readonly canScrollPrevious = computed(
    () => this.slides().length > 0 && this.activeIndex() > 0,
  );
  protected readonly canScrollNext = computed(
    () => this.activeIndex() < this.slides().length - 1,
  );

  constructor() {
    effect(() => {
      const slideCount = this.slides().length;

      if (slideCount === 0) {
        this.activeIndex.set(0);
        return;
      }

      if (this.activeIndex() >= slideCount) {
        this.activeIndex.set(slideCount - 1);
      }

      this.scheduleActiveSlideUpdate();
    });

    afterNextRender(() => {
      const track = this.track()?.nativeElement;
      const resizeObserver = this.document.defaultView?.ResizeObserver;

      this.updateActiveSlide();

      if (!track || !resizeObserver) {
        return;
      }

      const observer = new resizeObserver(() => this.scheduleActiveSlideUpdate());

      observer.observe(track);
      track.addEventListener('scroll', this.scheduleActiveSlideUpdate, { passive: true });

      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        track.removeEventListener('scroll', this.scheduleActiveSlideUpdate);
        this.cancelActiveSlideUpdate();
      });
    });
  }

  protected scrollPrevious(): void {
    this.scrollToSlide(this.activeIndex() - 1);
  }

  protected scrollNext(): void {
    this.scrollToSlide(this.activeIndex() + 1);
  }

  protected readonly scheduleActiveSlideUpdate = (): void => {
    this.cancelActiveSlideUpdate();

    const window = this.document.defaultView;

    if (!window) {
      queueMicrotask(this.updateActiveSlide);
      return;
    }

    this.activeSlideFrame = window.requestAnimationFrame(this.updateActiveSlide);
  };

  private scrollToSlide(index: number): void {
    const slides = this.slides();
    const targetIndex = Math.min(Math.max(index, 0), slides.length - 1);
    const target = slides[targetIndex];

    if (!target) {
      return;
    }

    target.element().scrollIntoView({
      block: 'nearest',
      inline: this.snapAlign(),
      behavior: this.scrollBehavior(),
    });
    this.activeIndex.set(targetIndex);
    this.scheduleActiveSlideUpdate();
  }

  private readonly updateActiveSlide = (): void => {
    const track = this.track()?.nativeElement;
    const slides = this.slides();

    if (!track || slides.length === 0) {
      this.activeIndex.set(0);
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideRect = slide.element().getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(trackCenter - slideCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    this.activeIndex.set(closestIndex);
  };

  private cancelActiveSlideUpdate(): void {
    if (!this.activeSlideFrame) {
      return;
    }

    this.document.defaultView?.cancelAnimationFrame(this.activeSlideFrame);
    this.activeSlideFrame = 0;
  }
}

function coerceSnapAlign(value: string | undefined): MediaSliderSnapAlign {
  return value === 'start' || value === 'end' ? value : 'center';
}

function coerceScrollBehavior(value: string | undefined): MediaSliderScrollBehavior {
  return value === 'auto' ? value : 'smooth';
}

function coerceSlideSize(value: string | undefined): string {
  return value?.trim() || 'min(78vw, 22rem)';
}
