import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChildren, input } from '@angular/core';

import { TimelineItemComponent } from './timeline-item';
import type { TimelineItemStatus, TimelineOrientation } from './timeline-types';

const TIMELINE_STATUS_ICONS: Record<TimelineItemStatus, string> = {
  done: 'check',
  'in-progress': 'sync',
  pending: '',
  blocked: 'block',
  error: 'close',
  skipped: 'skip_next',
  cancelled: 'cancel',
};

@Component({
  selector: 'ms-timeline',
  imports: [NgTemplateOutlet],
  templateUrl: './timeline.html',
})
export class TimelineComponent {
  readonly orientation = input<TimelineOrientation>('vertical');
  readonly ariaLabel = input('Timeline');

  readonly items = contentChildren(TimelineItemComponent);

  protected markerIcon(item: TimelineItemComponent): string {
    return item.icon() || TIMELINE_STATUS_ICONS[item.status()];
  }
}
