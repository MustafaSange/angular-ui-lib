import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  inject,
} from '@angular/core';

import { MediaCaptionDirective } from './media-caption';

@Component({
  selector: 'ms-media-slide',
  templateUrl: './media-slide.html',
  host: {
    class: 'media-slide',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSlideComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly caption = contentChild(MediaCaptionDirective);

  protected readonly hasCaption = computed(() => Boolean(this.caption()));

  element(): HTMLElement {
    return this.host.nativeElement;
  }
}
