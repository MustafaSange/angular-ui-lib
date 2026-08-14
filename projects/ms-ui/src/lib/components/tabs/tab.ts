import { Component, TemplateRef, contentChild, input, viewChild } from '@angular/core';

import { TabTitleDirective } from './tab-title';

@Component({
  selector: 'ms-tab',
  templateUrl: './tab.html',
})
export class TabComponent {
  readonly title = input<string>();
  readonly titleTemplate = contentChild(TabTitleDirective);
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}
