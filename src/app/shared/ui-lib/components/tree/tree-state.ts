import { DOCUMENT } from '@angular/common';
import { Injectable, ModelSignal, TemplateRef, inject, signal } from '@angular/core';

import type { TreeChildrenLoader, TreeNode, TreeNodeTemplateContext } from './tree-types';

@Injectable()
export class TreeState {
  private readonly document = inject(DOCUMENT);
  private host: HTMLElement | null = null;
  private selectedIdModel: ModelSignal<string | null> | null = null;
  private expandedIdsModel: ModelSignal<ReadonlySet<string>> | null = null;
  private activationHandler: ((node: TreeNode) => void) | null = null;

  readonly focusedId = signal<string | null>(null);
  readonly sharedLabelTemplate = signal<TemplateRef<TreeNodeTemplateContext> | null>(null);
  readonly labelTemplates = signal<ReadonlyMap<string, TemplateRef<TreeNodeTemplateContext>>>(
    new Map(),
  );
  readonly contentTemplates = signal<ReadonlyMap<string, TemplateRef<TreeNodeTemplateContext>>>(
    new Map(),
  );
  readonly dataLoader = signal<TreeChildrenLoader | null>(null);

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
    if (!disabled && this.focusedId() === null) {
      this.focusedId.set(nodeId);
    }
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

  isRtl(): boolean {
    if (!this.host) {
      return false;
    }

    return this.document.defaultView?.getComputedStyle(this.host).direction === 'rtl';
  }

  restoreFocusIfContained(container: HTMLElement, fallback: HTMLElement): void {
    const activeElement = this.document.activeElement;

    if (activeElement && container.contains(activeElement)) {
      queueMicrotask(() => this.focusElement(fallback));
    }
  }

  private visibleNodes(): HTMLElement[] {
    if (!this.host) {
      return [];
    }

    return Array.from(
      this.host.querySelectorAll<HTMLElement>('.tree-node[role="treeitem"]'),
    ).filter(
      (node) => node.getAttribute('aria-disabled') !== 'true' && node.closest('[hidden]') === null,
    );
  }
}
