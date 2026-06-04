import { Directive } from '@angular/core';

@Directive({
  selector: '[msMediaCaption]',
  host: {
    class: 'media-caption-content',
  },
})
export class MediaCaptionDirective {}
