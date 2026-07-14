import {
  Component,
  ElementRef,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';

import { TREE_NODE } from './tree-node-token';
import { TreeNodeComponent } from './tree-node';
import {
  TreeNodeContentForDirective,
  TreeNodeLabelForDirective,
  TreeNodeTemplateDirective,
} from './tree-node-templates';
import { TreeState } from './tree-state';
import type { TreeChildrenLoader, TreeMixedOrder, TreeNode } from './tree-types';

@Component({
  selector: 'ms-tree',
  imports: [TreeNodeComponent],
  providers: [TreeState],
  templateUrl: './tree.html',
})
export class TreeComponent<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly state = inject(TreeState);

  readonly nodes = input<readonly TreeNode<T>[]>([]);
  readonly ariaLabel = input('Tree');
  readonly mixedOrder = input<TreeMixedOrder>('projected-first');
  readonly loadChildren = input<TreeChildrenLoader<T> | null>(null);
  readonly selectedId = model<string | null>(null);
  readonly expandedIds = model<ReadonlySet<string>>(new Set());
  readonly nodeActivate = output<TreeNode<T>>();

  readonly projectedNodes = contentChildren(TREE_NODE, { descendants: false });
  readonly sharedNodeTemplate = contentChild(TreeNodeTemplateDirective);
  readonly labelTemplates = contentChildren(TreeNodeLabelForDirective, { descendants: true });
  readonly contentTemplates = contentChildren(TreeNodeContentForDirective, { descendants: true });

  constructor() {
    this.state.configure(this.host.nativeElement, this.selectedId, this.expandedIds, (node) =>
      this.nodeActivate.emit(node as TreeNode<T>),
    );

    effect(() => {
      const loader = this.loadChildren();
      this.state.dataLoader.set(loader as TreeChildrenLoader | null);
    });

    effect(() => {
      const template = this.sharedNodeTemplate()?.template ?? null;
      this.state.sharedLabelTemplate.set(template);
    });

    effect(() => {
      this.state.labelTemplates.set(
        new Map(this.labelTemplates().map((item) => [item.nodeId(), item.template])),
      );
      this.state.contentTemplates.set(
        new Map(this.contentTemplates().map((item) => [item.nodeId(), item.template])),
      );
    });

    effect(() => {
      for (const node of this.projectedNodes()) {
        node.assignHierarchy(1, null);
      }
    });
  }
}
