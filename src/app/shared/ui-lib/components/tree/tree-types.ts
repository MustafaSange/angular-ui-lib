import type { Signal } from '@angular/core';
import type { Observable } from 'rxjs';

export interface TreeNode<T = unknown> {
  id: string;
  label: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
  children?: readonly TreeNode<T>[];
  hasChildren?: boolean;
  data?: T;
}

export type TreeMixedOrder = 'projected-first' | 'data-first';

export type TreeChildrenSignal<T = unknown> = Signal<readonly TreeNode<T>[] | null>;

export type TreeChildrenSource<T = unknown> =
  | Promise<readonly TreeNode<T>[]>
  | Observable<readonly TreeNode<T>[]>
  | TreeChildrenSignal<T>;

export type TreeChildrenLoader<T = unknown> = (node: TreeNode<T>) => TreeChildrenSource<T>;

export type TreeNodeChildrenLoader<T = unknown> = () => TreeChildrenSource<T>;

export interface TreeNodeTemplateContext<T = unknown> {
  $implicit: TreeNode<T>;
  level: number;
  selected: boolean;
  expanded: boolean;
  loading: boolean;
}
