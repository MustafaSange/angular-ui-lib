# Feature 041: Time Ago Pipe

## Goal

Provide a reusable Angular pipe that converts dates into concise, locale-aware relative time text.
Consumers can choose a static result or a live result that refreshes as time passes.

## Public API

Import the pipe from the public UI library barrel:

```ts
import { TimeAgoPipe } from './shared/ui-lib';
```

Public pieces:

- `TimeAgoPipe` with pipe name `timeAgo`
- `transform(value, live?)` accepts `Date | string | null | undefined`
- `live` is an optional boolean and defaults to `false`

The pipe returns a string. Nullish values, empty strings, and invalid dates return an empty string.

## Desired Usage

Use the pipe without an argument for a static relative time string:

```html
<span>{{ createdAt | timeAgo }}</span>
```

Pass `true` to keep the relative time string updated:

```html
<span>{{ updatedAt | timeAgo: true }}</span>
```

A complete standalone Angular example:

```ts
import { Component } from '@angular/core';
import { TimeAgoPipe } from './shared/ui-lib';

@Component({
  selector: 'app-time-ago-example',
  imports: [TimeAgoPipe],
  template: `
    <p>Created {{ createdAt | timeAgo }}</p>
    <p>Updated {{ updatedAt | timeAgo: true }}</p>
  `,
})
export class TimeAgoExample {
  readonly createdAt = '2026-01-15T09:30:00Z';
  readonly updatedAt = new Date();
}
```

## Structure

The implementation lives in:

`src/app/shared/ui-lib/pipes/time-ago.pipe.ts`

The public exports live in:

- `src/app/shared/ui-lib/pipes/index.ts`
- `src/app/shared/ui-lib/index.ts`

No component, template, styles, service, or additional public types are required.

## Behavior

- Parse `Date` instances with `getTime()` and strings with `Date.parse()`.
- Treat whitespace-only strings, invalid dates, `null`, and `undefined` as invalid and return `''`.
- Calculate the difference from the current time whenever Angular evaluates the pipe.
- Use `Intl.RelativeTimeFormat` with the browser locale and `numeric: 'always'`.
- Produce past text such as `5 minutes ago` and future text such as `in 2 hours`.
- Select seconds for differences under one minute, minutes under one hour, hours under one day,
  days under one week, weeks under 30 days, months under 365 days, and years thereafter.
- Round the selected relative value to the nearest whole number.
- The pipe is impure and reads an internal signal while transforming a value so live instances are
  tracked by Angular's zoneless change-detection scheduler.

## Live Updates

- Static mode is the default and must not create a timer.
- Live mode is enabled only when the second pipe argument is `true`.
- Refresh every second for differences under one minute.
- Refresh every minute for differences under one hour.
- Refresh every hour for differences under one day.
- Refresh every day for larger differences.
- When the input timestamp or live option changes, cancel the previous timer before scheduling another.
- After a timer fires, update the internal signal so Angular schedules the consuming view without
  Zone.js, then schedule the next refresh when the pipe is evaluated again.
- Clear any active timer when the pipe is destroyed or receives an invalid or static input.

## Showcase

The showcase lives at `/time-ago` and is linked from the home showcase grid.

It demonstrates:

- static past dates across seconds, minutes, hours, days, and months
- a resettable live timestamp with a checkbox that enables or disables live updates
- future date formatting
- the empty-string result for invalid and missing values

Each example renders a matching copyable standalone Angular component with `ShowcaseCode`. Snippets
import `TimeAgoPipe` from the public `./shared/ui-lib` barrel.

## Angular Rules

- Use a standalone Angular pipe; do not add `standalone: true`.
- Use an internal signal to notify Angular about live timer updates in zoneless applications.
- Keep strict TypeScript and avoid `any`.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `TimeAgoPipe` is available from the public `src/app/shared/ui-lib` barrel.
- Both `Date` instances and parseable date strings produce relative time strings.
- Past and future timestamps are formatted using the browser locale.
- Invalid and empty values return an empty string without throwing.
- Static usage creates no timer.
- Live usage refreshes adaptively and cleans up timers when inputs change or the pipe is destroyed.
- The documented standalone example compiles against the public API.
- The `/time-ago` showcase demonstrates static, live, future, and invalid values with matching
  copyable snippets.
- The Angular build succeeds.
