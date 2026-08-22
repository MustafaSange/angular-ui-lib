import {
  Component,
  computed,
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
import { LanguageService } from '../../services/language';

@Component({
  selector: 'ms-tree',
  imports: [TreeNodeComponent],
  providers: [TreeState],
  templateUrl: './tree.html',
})
export class TreeComponent<T = unknown> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly state = inject(TreeState);
  private readonly languageService = inject(LanguageService);

  readonly nodes = input<readonly TreeNode<T>[]>([]);
  readonly ariaLabel = input<string | null>(null);
  readonly emptyText = input<string | null>(null);
  readonly loadingText = input<string | null>(null);
  readonly loadErrorText = input<string | null>(null);
  readonly retryText = input<string | null>(null);
  readonly mixedOrder = input<TreeMixedOrder>('projected-first');
  readonly loadChildren = input<TreeChildrenLoader<T> | null>(null);
  readonly selectedId = model<string | null>(null);
  readonly expandedIds = model<ReadonlySet<string>>(new Set());
  readonly nodeActivate = output<TreeNode<T>>();
  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.languageService.translate('accessibility.tree'),
  );
  protected readonly resolvedEmptyText = computed(
    () => this.emptyText() ?? this.languageService.translate('tree.noItems'),
  );

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
      this.state.loadingText.set(
        this.loadingText() ?? this.languageService.translate('tree.loadingItems'),
      );
      this.state.loadErrorText.set(
        this.loadErrorText() ?? this.languageService.translate('tree.loadError'),
      );
      this.state.retryText.set(this.retryText() ?? this.languageService.translate('common.retry'));
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
