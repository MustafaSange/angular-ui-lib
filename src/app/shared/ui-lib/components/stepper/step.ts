import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  input,
  viewChild,
} from '@angular/core';

import { StepTitleDirective } from './step-title';

@Component({
  selector: 'ms-step',
  templateUrl: './step.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepComponent {
  readonly title = input('');
  readonly completed = input(false);
  readonly disabled = input(false);

  readonly titleTemplate = contentChild(StepTitleDirective);
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}
