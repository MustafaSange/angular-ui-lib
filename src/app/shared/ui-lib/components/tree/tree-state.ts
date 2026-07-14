import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, ModelSignal, TemplateRef, inject, signal } from '@angular/core';

import type { TreeChildrenLoader, TreeNode, TreeNodeTemplateContext } from './tree-types';

const TYPEAHEAD_RESET_DELAY = 500;

@Injectable()
export class TreeState {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private host: HTMLElement | null = null;
  private selectedIdModel: ModelSignal<string | null> | null = null;
  private expandedIdsModel: ModelSignal<ReadonlySet<string>> | null = null;
  private activationHandler: ((node: TreeNode) => void) | null = null;
  private focusReconciliationQueued = false;
  private restoreDomFocus = false;
  private lastVisibleNodeIds: readonly string[] = [];
  private typeaheadQuery = '';
  private typeaheadResetTimer: ReturnType<typeof setTimeout> | null = null;

  readonly focusedId = signal<string | null>(null);
  readonly sharedLabelTemplate = signal<TemplateRef<TreeNodeTemplateContext> | null>(null);
  readonly labelTemplates = signal<ReadonlyMap<string, TemplateRef<TreeNodeTemplateContext>>>(
    new Map(),
  );
  readonly contentTemplates = signal<ReadonlyMap<string, TemplateRef<TreeNodeTemplateContext>>>(
    new Map(),
  );
  readonly dataLoader = signal<TreeChildrenLoader | null>(null);
  readonly loadingText = signal('Loading items…');
  readonly loadErrorText = signal('Couldn’t load items.');
  readonly retryText = signal('Retry');

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTypeahead());
  }

  configure(
    host: HTMLElement,
    selectedId: ModelSignal<string | null>,
    expandedIds: ModelSignal<ReadonlySet<string>>,
    activationHandler: (node: TreeNode) => void,
  ): void {
    this.host = host;
    this.selectedIdModel = selectedId;
    this.expandedIdsModel = expandedIds;
    this.activationHandler = activationHandler;
  }

  selectedId(): string | null {
    return this.selectedIdModel?.() ?? null;
  }

  expandedIds(): ReadonlySet<string> {
    return this.expandedIdsModel?.() ?? new Set<string>();
  }

  isExpanded(nodeId: string): boolean {
    return this.expandedIds().has(nodeId);
  }

  setExpanded(nodeId: string, expanded: boolean): void {
    const ids = new Set(this.expandedIds());

    if (expanded) {
      ids.add(nodeId);
    } else {
      ids.delete(nodeId);
    }

    this.expandedIdsModel?.set(ids);
  }

  select(node: TreeNode, activate: boolean): void {
    this.selectedIdModel?.set(node.id);
    this.focusedId.set(node.id);

    if (activate) {
      this.activationHandler?.(node);
    }
  }

  ensureFocusable(nodeId: string, disabled: boolean): void {
    if (disabled && this.focusedId() === nodeId) {
      this.restoreDomFocus ||= this.isFocusWithinTree();
    }

    this.reconcileFocusableNodes();
  }

  removeFocusable(nodeId: string): void {
    if (this.focusedId() === nodeId) {
      this.restoreDomFocus ||= this.isFocusWithinTree();
    }

    this.reconcileFocusableNodes();
  }

  reconcileFocusableNodes(): void {
    if (this.focusReconciliationQueued) {
      return;
    }

    this.focusReconciliationQueued = true;
    queueMicrotask(() => {
      this.focusReconciliationQueued = false;
      this.reconcileFocusableNode();
    });
  }

  focusElement(element: HTMLElement): void {
    const nodeId = element.dataset['treeNodeId'];

    if (nodeId) {
      this.focusedId.set(nodeId);
    }

    element.focus();
  }

  focusOffset(current: HTMLElement, offset: -1 | 1): void {
    const nodes = this.visibleNodes();
    const index = nodes.indexOf(current);
    const target = nodes[index + offset];

    if (target) {
      this.focusElement(target);
    }
  }

  focusBoundary(boundary: 'first' | 'last'): void {
    const nodes = this.visibleNodes();
    const target = boundary === 'first' ? nodes[0] : nodes.at(-1);

    if (target) {
      this.focusElement(target);
    }
  }

  focusFirstChild(current: HTMLElement, level: number): void {
    const nodes = this.visibleNodes();
    const index = nodes.indexOf(current);
    const target = nodes[index + 1];

    if (target && Number(target.getAttribute('aria-level')) > level) {
      this.focusElement(target);
    }
  }

  focusParent(current: HTMLElement, level: number): void {
    const nodes = this.visibleNodes();
    const index = nodes.indexOf(current);

    for (let candidateIndex = index - 1; candidateIndex >= 0; candidateIndex--) {
      const candidate = nodes[candidateIndex];

      if (candidate && Number(candidate.getAttribute('aria-level')) < level) {
        this.focusElement(candidate);
        return;
      }
    }
  }

  focusByTypeahead(current: HTMLElement, event: KeyboardEvent): boolean {
    if (
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.key === ' ' ||
      Array.from(event.key).length !== 1
    ) {
      return false;
    }

    const key = this.normalizeTypeaheadText(event.key);

    if (!key) {
      return false;
    }

    const repeatedCharacter =
      this.typeaheadQuery.length > 0 &&
      Array.from(this.typeaheadQuery).every((character) => character === key);

    this.typeaheadQuery = repeatedCharacter ? key : `${this.typeaheadQuery}${key}`;
    this.restartTypeaheadResetTimer();

    const nodes = this.visibleNodes();
    const currentIndex = nodes.indexOf(current);
    const candidates = [...nodes.slice(currentIndex + 1), ...nodes.slice(0, currentIndex + 1)];
    const target = candidates.find((node) =>
      this.normalizeTypeaheadText(node.getAttribute('aria-label') ?? '').startsWith(
        this.typeaheadQuery,
      ),
    );

    if (target) {
      this.focusElement(target);
    }

    return true;
  }

  isRtl(): boolean {
    if (!this.host) {
      return false;
    }

    return this.document.defaultView?.getComputedStyle(this.host).direction === 'rtl';
  }

  restoreFocusIfContained(container: HTMLElement, fallback: HTMLElement): void {
    const activeElement = this.document.activeElement;
    const focusedNode = this.findNode(
      Array.from(container.querySelectorAll<HTMLElement>('.tree-node[role="treeitem"]')),
      this.focusedId(),
    );

    if (focusedNode) {
      const fallbackId = fallback.dataset['treeNodeId'];

      if (fallbackId) {
        this.focusedId.set(fallbackId);
      }
    }

    if (activeElement && container.contains(activeElement)) {
      queueMicrotask(() => this.focusElement(fallback));
    }
  }

  private reconcileFocusableNode(): void {
    const renderedNodes = this.renderedNodes();
    const enabledNodes = renderedNodes.filter(
      (node) => node.getAttribute('aria-disabled') !== 'true',
    );
    const currentId = this.focusedId();
    const currentNode = this.findNode(enabledNodes, currentId);

    if (currentNode) {
      this.lastVisibleNodeIds = renderedNodes.map((node) => this.nodeId(node));
      this.restoreDomFocus = false;
      return;
    }

    const selectedNode = currentId === null ? this.findNode(enabledNodes, this.selectedId()) : null;
    const target =
      selectedNode ??
      this.findNearestNode(renderedNodes, enabledNodes, currentId) ??
      enabledNodes[0];

    this.lastVisibleNodeIds = renderedNodes.map((node) => this.nodeId(node));
    this.focusedId.set(target ? this.nodeId(target) : null);

    if (target && this.restoreDomFocus) {
      target.focus();
    }

    this.restoreDomFocus = false;
  }

  private findNearestNode(
    renderedNodes: readonly HTMLElement[],
    enabledNodes: readonly HTMLElement[],
    currentId: string | null,
  ): HTMLElement | undefined {
    if (currentId === null) {
      return undefined;
    }

    const enabledById = new Map(enabledNodes.map((node) => [this.nodeId(node), node]));
    const currentOrder = renderedNodes.map((node) => this.nodeId(node));
    const currentIndex = currentOrder.indexOf(currentId);

    if (currentIndex >= 0) {
      return (
        currentOrder
          .slice(currentIndex + 1)
          .map((id) => enabledById.get(id))
          .find(Boolean) ??
        currentOrder
          .slice(0, currentIndex)
          .reverse()
          .map((id) => enabledById.get(id))
          .find(Boolean)
      );
    }

    const previousIndex = this.lastVisibleNodeIds.indexOf(currentId);

    if (previousIndex < 0) {
      return undefined;
    }

    return (
      this.lastVisibleNodeIds
        .slice(previousIndex + 1)
        .map((id) => enabledById.get(id))
        .find(Boolean) ??
      this.lastVisibleNodeIds
        .slice(0, previousIndex)
        .reverse()
        .map((id) => enabledById.get(id))
        .find(Boolean)
    );
  }

  private findNode(nodes: readonly HTMLElement[], nodeId: string | null): HTMLElement | undefined {
    return nodeId === null ? undefined : nodes.find((node) => this.nodeId(node) === nodeId);
  }

  private nodeId(node: HTMLElement): string {
    return node.dataset['treeNodeId'] ?? '';
  }

  private isFocusWithinTree(): boolean {
    const activeElement = this.document.activeElement;

    return Boolean(this.host && activeElement && this.host.contains(activeElement));
  }

  private restartTypeaheadResetTimer(): void {
    if (this.typeaheadResetTimer !== null) {
      clearTimeout(this.typeaheadResetTimer);
    }

    this.typeaheadResetTimer = setTimeout(() => this.clearTypeahead(), TYPEAHEAD_RESET_DELAY);
  }

  private clearTypeahead(): void {
    if (this.typeaheadResetTimer !== null) {
      clearTimeout(this.typeaheadResetTimer);
      this.typeaheadResetTimer = null;
    }

    this.typeaheadQuery = '';
  }

  private normalizeTypeaheadText(value: string): string {
    return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  }

  private visibleNodes(): HTMLElement[] {
    return this.renderedNodes().filter((node) => node.getAttribute('aria-disabled') !== 'true');
  }

  private renderedNodes(): HTMLElement[] {
    if (!this.host) {
      return [];
    }

    return Array.from(
      this.host.querySelectorAll<HTMLElement>('.tree-node[role="treeitem"]'),
    ).filter((node) => node.closest('[hidden]') === null);
  }
}
