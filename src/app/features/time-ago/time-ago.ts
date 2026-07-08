import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode, TimeAgoPipe } from '../../shared/ui-lib';

@Component({
  selector: 'app-time-ago',
  imports: [RouterLink, ShowcaseCode, TimeAgoPipe],
  templateUrl: './time-ago.html',
  styleUrl: './time-ago.scss',
})
export class TimeAgo {
  protected readonly now = Date.now();
  protected readonly staticDates = [
    { label: 'Seconds', value: new Date(this.now - 25_000) },
    { label: 'Minutes', value: new Date(this.now - 12 * 60_000) },
    { label: 'Hours', value: new Date(this.now - 3 * 60 * 60_000) },
    { label: 'Days', value: new Date(this.now - 4 * 24 * 60 * 60_000) },
    { label: 'Months', value: new Date(this.now - 75 * 24 * 60 * 60_000) },
  ];
  protected readonly futureDate = new Date(this.now + 2 * 60 * 60_000);
  protected readonly invalidDate = 'not-a-date';
  protected readonly liveDate = signal(new Date());
  protected readonly liveEnabled = signal(true);

  protected readonly staticSnippet = `import { Component } from '@angular/core';

import { TimeAgoPipe } from './shared/ui-lib';

@Component({
  selector: 'app-static-time-ago-example',
  imports: [TimeAgoPipe],
  template: \`
    <p>Published {{ publishedAt | timeAgo }}</p>
    <p>Reviewed {{ reviewedAt | timeAgo }}</p>
  \`,
})
export class StaticTimeAgoExample {
  readonly publishedAt = new Date(Date.now() - 12 * 60_000);
  readonly reviewedAt = '2026-01-15T09:30:00Z';
}`;

  protected readonly liveSnippet = `import { Component, signal } from '@angular/core';

import { TimeAgoPipe } from './shared/ui-lib';

@Component({
  selector: 'app-live-time-ago-example',
  imports: [TimeAgoPipe],
  template: \`
    <label>
      <input
        type="checkbox"
        [checked]="liveEnabled()"
        (change)="liveEnabled.set(!liveEnabled())"
      />
      Live updates
    </label>
    <p>Last activity {{ activityAt() | timeAgo: liveEnabled() }}</p>
    <button type="button" (click)="activityAt.set(now())">Reset activity</button>
  \`,
})
export class LiveTimeAgoExample {
  readonly activityAt = signal(new Date());
  readonly liveEnabled = signal(true);

  protected now(): Date {
    return new Date();
  }
}`;

  protected readonly edgeCasesSnippet = `import { Component } from '@angular/core';

import { TimeAgoPipe } from './shared/ui-lib';

@Component({
  selector: 'app-time-ago-values-example',
  imports: [TimeAgoPipe],
  template: \`
    <p>Starts {{ startsAt | timeAgo }}</p>
    <p>Unknown: "{{ invalidValue | timeAgo }}"</p>
    <p>Missing: "{{ missingValue | timeAgo }}"</p>
  \`,
})
export class TimeAgoValuesExample {
  readonly startsAt = new Date(Date.now() + 2 * 60 * 60_000);
  readonly invalidValue = 'not-a-date';
  readonly missingValue = null;
}`;

  protected resetLiveDate(): void {
    this.liveDate.set(new Date());
  }

  protected toggleLive(): void {
    this.liveEnabled.update((enabled) => !enabled);
  }
}
