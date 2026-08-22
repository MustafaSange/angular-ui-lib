import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, inject, input } from '@angular/core';

import { LanguageService } from '../../services/language';
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
  private readonly languageService = inject(LanguageService);
  readonly orientation = input<TimelineOrientation>('vertical');
  readonly ariaLabel = input<string | null>(null);
  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.languageService.translate('accessibility.timeline'),
  );

  readonly items = contentChildren(TimelineItemComponent);

  protected markerIcon(item: TimelineItemComponent): string {
    return item.icon() || TIMELINE_STATUS_ICONS[item.status()];
  }
}
