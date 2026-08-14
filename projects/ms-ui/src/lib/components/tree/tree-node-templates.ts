import { Directive, TemplateRef, inject, input } from '@angular/core';

import type { TreeNodeTemplateContext } from './tree-types';

@Directive({
  selector: 'ng-template[msTreeNode]',
})
export class TreeNodeTemplateDirective<T = unknown> {
  readonly template = inject<TemplateRef<TreeNodeTemplateContext<T>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[msTreeNodeLabelFor]',
})
export class TreeNodeLabelForDirective<T = unknown> {
  readonly nodeId = input.required<string>({ alias: 'msTreeNodeLabelFor' });
  readonly template = inject<TemplateRef<TreeNodeTemplateContext<T>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[msTreeNodeContentFor]',
})
export class TreeNodeContentForDirective<T = unknown> {
  readonly nodeId = input.required<string>({ alias: 'msTreeNodeContentFor' });
  readonly template = inject<TemplateRef<TreeNodeTemplateContext<T>>>(TemplateRef);
}
