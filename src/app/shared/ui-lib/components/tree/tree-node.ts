import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { TreeChildrenResolver } from './tree-children-resolver';
import { TreeNodeContentDirective } from './tree-node-content';
import { TreeNodeLabelDirective } from './tree-node-label';
import { TREE_NODE } from './tree-node-token';
import { TreeState } from './tree-state';
import type {
  TreeChildrenSource,
  TreeMixedOrder,
  TreeNode,
  TreeNodeChildrenLoader,
  TreeNodeTemplateContext,
} from './tree-types';

let nextTreeNodeId = 0;

type TreeLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

@Component({
  selector: 'ms-tree-node',
  imports: [NgTemplateOutlet, forwardRef(() => TreeNodeComponent)],
  providers: [
    TreeChildrenResolver,
    { provide: TREE_NODE, useExisting: forwardRef(() => TreeNodeComponent) },
  ],
  templateUrl: './tree-node.html',
})
export class TreeNodeComponent<T = unknown> {
  protected readonly state = inject(TreeState);
  private readonly childrenResolver = inject(TreeChildrenResolver);
  private readonly generatedId = `ms-tree-node-${nextTreeNodeId++}`;
  private readonly assignedLevel = signal<number | null>(null);
  private readonly assignedParentId = signal<string | null>(null);
  private readonly loadedChildren = signal<readonly TreeNode<T>[] | null>(null);
  private readonly loadStatus = signal<TreeLoadStatus>('idle');

  readonly nodeId = input.required<string>();
  readonly label = input('');
  readonly content = input('');
  readonly ariaLabel = input('');
  readonly icon = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly hasChildren = input(false, { transform: booleanAttribute });
  readonly nodes = input<readonly TreeNode<T>[]>([]);
  readonly data = input<T>();
  readonly mixedOrder = input<TreeMixedOrder>('projected-first');
  readonly loadChildren = input<TreeNodeChildrenLoader<T> | null>(null);

  readonly treeLevel = input(1);
  readonly parentNodeId = input<string | null>(null);

  readonly projectedLabel = contentChild(TreeNodeLabelDirective);
  readonly projectedContent = contentChild(TreeNodeContentDirective);
  readonly projectedChildren = contentChildren(TREE_NODE, { descendants: false });
  readonly treeElement = viewChild.required<ElementRef<HTMLElement>>('treeElement');
  readonly collapsibleContent = viewChild<ElementRef<HTMLElement>>('collapsibleContent');

  protected readonly loading = computed(() => this.loadStatus() === 'loading');
  protected readonly loadError = computed(() => this.loadStatus() === 'error');
  protected readonly level = computed(() => this.assignedLevel() ?? this.treeLevel());
  protected readonly parentId = computed(() => this.assignedParentId() ?? this.parentNodeId());
  protected readonly resolvedNodes = computed(() => this.loadedChildren() ?? this.nodes());
  protected readonly selected = computed(() => this.state.selectedId() === this.nodeId());
  protected readonly expanded = computed(
    () => !this.disabled() && this.state.isExpanded(this.nodeId()),
  );
  protected readonly keyedLabelTemplate = computed(
    () =>
      this.state.labelTemplates().get(this.nodeId()) ?? this.state.sharedLabelTemplate() ?? null,
  );
  protected readonly keyedContentTemplate = computed(
    () => this.state.contentTemplates().get(this.nodeId()) ?? null,
  );
  protected readonly hasBodyContent = computed(() =>
    Boolean(this.projectedContent() || this.content() || this.keyedContentTemplate()),
  );
  protected readonly expandable = computed(() => {
    const unresolvedLazyBranch =
      this.loadStatus() !== 'loaded' && Boolean(this.loadChildren() || this.hasChildren());

    return Boolean(
      this.hasBodyContent() ||
      this.projectedChildren().length > 0 ||
      this.resolvedNodes().length > 0 ||
      unresolvedLazyBranch,
    );
  });
  protected readonly contentId = `${this.generatedId}-content`;
  protected readonly labelId = `${this.generatedId}-label`;
  protected readonly sourceNode = computed<TreeNode<T>>(() => ({
    id: this.nodeId(),
    label:
      this.ariaLabel() ||
      this.projectedLabel()?.element.nativeElement.textContent?.trim() ||
      this.label() ||
      this.nodeId(),
    content: this.content() || undefined,
    icon: this.icon() || undefined,
    disabled: this.disabled(),
    children: this.resolvedNodes(),
    hasChildren: this.expandable(),
    data: this.data(),
  }));
  protected readonly templateContext = computed<TreeNodeTemplateContext<T>>(() => ({
    $implicit: this.sourceNode(),
    level: this.level(),
    selected: this.selected(),
    expanded: this.expanded(),
    loading: this.loading(),
  }));
  protected readonly accessibleLabel = computed(() => {
    const projectedText = this.projectedLabel()?.element.nativeElement.textContent?.trim();

    return this.ariaLabel() || projectedText || this.label() || this.nodeId();
  });

  constructor() {
    this.syncFocusableNode();
    this.syncProjectedChildHierarchy();
    this.watchExpansion();
  }

  assignHierarchy(level: number, parentId: string | null): void {
    this.assignedLevel.set(level);
    this.assignedParentId.set(parentId);
  }

  protected handleFocus(): void {
    if (!this.disabled()) {
      this.state.focusedId.set(this.nodeId());
    }
  }

  protected handleRowClick(): void {
    if (this.disabled()) {
      return;
    }

    this.state.focusElement(this.treeElement().nativeElement);
    this.state.select(this.sourceNode(), true);
  }

  protected toggle(event?: Event): void {
    event?.stopPropagation();

    if (this.disabled() || !this.expandable()) {
      return;
    }

    this.state.setExpanded(this.nodeId(), !this.expanded());
  }

  protected retry(event: Event): void {
    event.stopPropagation();
    void this.loadLazyChildren(true);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.target !== event.currentTarget || this.disabled()) {
      return;
    }

    const treeElement = this.treeElement().nativeElement;
    const inlineEndKey = this.state.isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const inlineStartKey = this.state.isRtl() ? 'ArrowRight' : 'ArrowLeft';

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.state.focusOffset(treeElement, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.state.focusOffset(treeElement, -1);
        break;
      case 'Home':
        event.preventDefault();
        this.state.focusBoundary('first');
        break;
      case 'End':
        event.preventDefault();
        this.state.focusBoundary('last');
        break;
      case 'Enter':
        event.preventDefault();
        this.state.select(this.sourceNode(), true);
        break;
      case ' ':
        event.preventDefault();
        this.state.select(this.sourceNode(), false);
        break;
      default:
        this.handleInlineNavigation(event, treeElement, inlineStartKey, inlineEndKey);
    }
  }

  private syncFocusableNode(): void {
    effect(() => {
      const nodeId = this.nodeId();
      this.state.ensureFocusable(nodeId, this.disabled());
    });
  }

  private syncProjectedChildHierarchy(): void {
    effect(() => {
      const childLevel = this.level() + 1;
      const parentId = this.nodeId();

      for (const child of this.projectedChildren()) {
        child.assignHierarchy(childLevel, parentId);
      }
    });
  }

  private watchExpansion(): void {
    let wasExpanded = false;

    effect(() => {
      const expanded = this.expanded();
      const hasLoader = this.hasAvailableLoader();

      if (expanded && hasLoader) {
        untracked(() => void this.loadLazyChildren());
      } else if (wasExpanded && !expanded) {
        this.restoreFocusToNode();
      }

      wasExpanded = expanded;
    });
  }

  private restoreFocusToNode(): void {
    const content = this.collapsibleContent()?.nativeElement;

    if (content) {
      this.state.restoreFocusIfContained(content, this.treeElement().nativeElement);
    }
  }

  private handleInlineNavigation(
    event: KeyboardEvent,
    treeElement: HTMLElement,
    inlineStartKey: string,
    inlineEndKey: string,
  ): void {
    if (event.key === inlineEndKey) {
      event.preventDefault();

      if (this.expandable() && !this.expanded()) {
        this.toggle();
      } else if (this.expanded()) {
        this.state.focusFirstChild(treeElement, this.level());
      }
    } else if (event.key === inlineStartKey) {
      event.preventDefault();

      if (this.expandable() && this.expanded()) {
        this.toggle();
      } else if (this.parentId()) {
        this.state.focusParent(treeElement, this.level());
      }
    }
  }

  private async loadLazyChildren(force = false): Promise<void> {
    if (!this.canLoadChildren(force)) {
      return;
    }

    const nodeLoader = this.loadChildren();
    const dataLoader = this.state.dataLoader();
    this.loadStatus.set('loading');

    try {
      const source = nodeLoader ? nodeLoader() : dataLoader!(this.sourceNode() as TreeNode);
      const children = await this.childrenResolver.resolve(source as TreeChildrenSource<T>);
      this.loadedChildren.set(children);
      this.loadStatus.set('loaded');

      if (
        children.length === 0 &&
        !this.hasBodyContent() &&
        this.projectedChildren().length === 0
      ) {
        this.state.setExpanded(this.nodeId(), false);
      }
    } catch {
      this.loadStatus.set('error');
    }
  }

  private canLoadChildren(force: boolean): boolean {
    const status = this.loadStatus();

    if (!this.hasAvailableLoader() || status === 'loading' || this.resolvedNodes().length > 0) {
      return false;
    }

    return force ? status === 'error' : status === 'idle';
  }

  private hasAvailableLoader(): boolean {
    return Boolean(this.loadChildren() || (this.hasChildren() && this.state.dataLoader()));
  }
}
