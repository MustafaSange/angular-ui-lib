import { Component, TemplateRef, contentChild, input, viewChild } from '@angular/core';

import { TimelineMetaDirective } from './timeline-meta';
import { TimelineSubtitleDirective } from './timeline-subtitle';
import { TimelineTitleDirective } from './timeline-title';
import type { TimelineItemStatus } from './timeline-types';

@Component({
  selector: 'ms-timeline-item',
  templateUrl: './timeline-item.html',
})
export class TimelineItemComponent {
  readonly status = input<TimelineItemStatus>('pending');
  readonly title = input('');
  readonly subtitle = input('');
  readonly meta = input('');
  readonly icon = input('');

  readonly titleTemplate = contentChild(TimelineTitleDirective);
  readonly subtitleTemplate = contentChild(TimelineSubtitleDirective);
  readonly metaTemplate = contentChild(TimelineMetaDirective);
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}
