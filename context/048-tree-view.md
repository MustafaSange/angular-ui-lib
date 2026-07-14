# Feature 048: Tree View

## Goal

Create a compact, accessible tree view for hierarchical navigation. The feature supports
data-driven nodes, projected `ms-tree-node` composition, plain-text and projected labels and
content, single selection, controlled expansion, lazy children, configurable mixed ordering, and
logical LTR/RTL keyboard behavior.

## Public API

Import tree APIs from the folder barrel or top-level UI library barrel:

```ts
import {
  TreeChildrenLoader,
  TreeChildrenSignal,
  TreeChildrenSource,
  TreeComponent,
  TreeMixedOrder,
  TreeNode,
  TreeNodeComponent,
  TreeNodeContentDirective,
  TreeNodeContentForDirective,
  TreeNodeLabelDirective,
  TreeNodeLabelForDirective,
  TreeNodeTemplateDirective,
} from './shared/ui-lib';
```

Public components and directives:

- `TreeComponent` with selector `ms-tree`
- `TreeNodeComponent` with selector `ms-tree-node`
- `TreeNodeLabelDirective` with selector `[msTreeNodeLabel]`
- `TreeNodeContentDirective` with selector `[msTreeNodeContent]`
- `TreeNodeTemplateDirective` with selector `ng-template[msTreeNode]`
- `TreeNodeLabelForDirective` with selector `ng-template[msTreeNodeLabelFor]`
- `TreeNodeContentForDirective` with selector `ng-template[msTreeNodeContentFor]`

Types:

```ts
interface TreeNode<T = unknown> {
  id: string;
  label: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
  children?: readonly TreeNode<T>[];
  hasChildren?: boolean;
  data?: T;
}

type TreeMixedOrder = 'projected-first' | 'data-first';

type TreeChildrenSignal<T = unknown> = Signal<readonly TreeNode<T>[] | null>;

type TreeChildrenSource<T = unknown> =
  | Promise<readonly TreeNode<T>[]>
  | Observable<readonly TreeNode<T>[]>
  | TreeChildrenSignal<T>;

type TreeChildrenLoader<T = unknown> = (node: TreeNode<T>) => TreeChildrenSource<T>;
```

`TreeComponent` exposes:

- `nodes`, defaulting to an empty array
- `ariaLabel`, defaulting to `Tree`
- `mixedOrder`, defaulting to `projected-first`
- optional `loadChildren`
- two-way `selectedId`, defaulting to `null`
- two-way `expandedIds`, defaulting to an empty read-only set
- `nodeActivate`, emitting the activated `TreeNode`

`TreeNodeComponent` exposes:

- required `nodeId`
- optional `label`, `content`, `ariaLabel`, `icon`, and `data`
- `disabled` and `hasChildren`, defaulting to false
- `nodes`, defaulting to an empty array
- `mixedOrder`, defaulting to `projected-first`
- optional no-argument `loadChildren` callback for that projected node

Node IDs must be unique within one tree.

## Desired Usage

Plain-text label and content:

```html
<ms-tree-node nodeId="favorites" label="Favorites" content="Recently pinned project files." />
```

Projected label and content:

```html
<ms-tree-node nodeId="favorites" ariaLabel="Favorites, 4 items">
  <span msTreeNodeLabel>Favorites <ms-badge>4</ms-badge></span>

  <div msTreeNodeContent>
    <p>Recently pinned project files.</p>
    <button class="btn btn-secondary" type="button">Manage favorites</button>
  </div>
</ms-tree-node>
```

Data and projected roots together:

```html
<ms-tree [nodes]="nodes" mixedOrder="data-first">
  <ng-template msTreeNodeLabelFor="reports" let-node>
    {{ node.label }} <ms-badge>{{ node.data.owner }}</ms-badge>
  </ng-template>

  <ng-template msTreeNodeContentFor="reports" let-node>
    Maintained by {{ node.data.owner }}.
  </ng-template>

  <ms-tree-node nodeId="favorites" label="Favorites" icon="favorite" />
</ms-tree>
```

Lazy children can use any of the supported source types:

```ts
// Promise
const loadFromPromise: TreeChildrenLoader = async (node) => {
  const response = await fetch(`/api/tree/${node.id}/children`);
  return response.json() as Promise<readonly TreeNode[]>;
};

// Observable: the tree uses the first emission.
const loadFromObservable: TreeChildrenLoader = (node) =>
  of([{ id: `${node.id}-child`, label: 'Loaded child' }]).pipe(delay(500));

// Signal: null means loading; the first array completes the load.
const loadFromSignal: TreeChildrenLoader = (node) => {
  const children = signal<readonly TreeNode[] | null>(null);
  setTimeout(() => children.set([{ id: `${node.id}-child`, label: 'Loaded child' }]), 500);
  return children.asReadonly();
};
```

## Component Structure and Projection

The implementation lives in `src/app/shared/ui-lib/components/tree`:

- `TreeComponent` owns selection, expansion, activation, data loading, projected root hierarchy,
  and data-node template registration.
- `TreeNodeComponent` renders authored and generated nodes recursively and owns a single
  `idle`/`loading`/`loaded`/`error` lifecycle for its lazy children.
- The internal `TreeChildrenResolver` normalizes Promise, Observable, and Signal sources into one
  awaited child-array result. It also cleans up Observable subscriptions and Signal effects when
  the node is destroyed.
- A component-scoped tree state coordinates mixed projected/data descendants and DOM focus.
- Public reusable contracts live in `tree-types.ts`.
- Focused projection and keyed-template directives live in sibling files.

Resolution rules:

- Projected `[msTreeNodeLabel]` content visually overrides the `label` input.
- Projected `[msTreeNodeContent]` content visually overrides the `content` input.
- Label and content resolve independently, so text and projection may be mixed.
- Input text is interpolated as plain escaped text and is never treated as HTML.
- `ariaLabel` overrides the accessible name for a rich projected label.
- A node must have a text label or projected label content.
- Projected labels must remain non-interactive; projected expanded content may contain native or
  Angular interactive controls.
- Native projected content stays instantiated when collapsed and is hidden by its owning region.
- The shared `msTreeNode` template customizes data-node labels. A matching
  `msTreeNodeLabelFor="id"` template takes precedence for that ID.
- `msTreeNodeContentFor="id"` provides expanded rich content for one data-node ID.

## Behavior

- Render data nodes, projected nodes, or both within the same root or projected parent.
- Use `mixedOrder` to place projected or data children first. Projected nodes default to first.
- Show disclosure affordance for content, child nodes, declared lazy children, or a node loader.
- Clicking disclosure toggles expansion without selection or activation.
- Clicking an enabled row focuses, selects, and emits activation for the node.
- Enter selects and activates; Space selects without activation.
- Up and Down move through visible enabled nodes; Home and End move to the visible boundaries.
- Logical inline-end expands a closed branch or enters its first child. Logical inline-start
  collapses an open branch or focuses its parent. These keys mirror in RTL.
- Disabled nodes remain visible but cannot receive tree focus, select, activate, or expand.
- Render expanded body content before child nodes.
- If collapse hides focused body content, move focus back to its owning tree item.
- Keep selected and expanded state controlled through their model signals.

## Lazy Loading

- Treat `hasChildren: true` without immediate children as a lazy branch.
- Call the tree-level `loadChildren(node)` callback on first expansion of a data node.
- A projected node may instead provide its own no-argument `loadChildren` callback.
- Accept a Promise, Observable, or Signal from either loader callback.
- Await Promise resolution and treat rejection as a load failure.
- Use the first Observable emission as the child array, then end the subscription.
- Treat `null` from a Signal as loading and use the first non-null child array as success. A thrown
  Signal read is a load failure.
- Prevent duplicate concurrent loads and cache successful children for the component lifetime.
- Keep the node in `loaded` state after success, including an empty result, so collapsing and
  reopening never invokes the loader again.
- Keep the node in `error` state after failure; only Retry starts another attempt.
- Keep an in-flight request running when the node collapses.
- Convert a successful empty result into a leaf unless the node also has projected content or
  projected children.
- On rejection, retain the branch and render an accessible error with a Retry action.
- Retry clears the error and invokes the loader again.

## Styling

Feature styles live in `src/styles/components/_tree.scss` and are forwarded from the component
style index.

- Use `--control-height-sm` for dense rows and existing typography, surface, spacing, border,
  radius, transition, and focus tokens.
- Use `.tree-*` internal hooks and keep Material Symbols on the established `.ms-icon` utility.
- Use logical indentation and margins so hierarchy mirrors naturally in RTL.
- Rotate disclosure chevrons according to direction and expanded state.
- Use subtle primary selection, visible focus, muted icons, disabled presentation, and truncated
  labels.
- Keep projected content visually subordinate to its owning row and indent it with the hierarchy.

## Accessibility

- Render the root with `role="tree"` and an accessible label.
- Render nodes with `role="treeitem"`, roving tabindex, `aria-level`, `aria-selected`, conditional
  `aria-expanded`, `aria-disabled`, and `aria-busy`.
- Render descendant collections with `role="group"`.
- Render expanded content as a labelled region associated with the owning node.
- Hide collapsed content and descendants from visual layout and the accessibility tree.
- Keep projected body controls in native Tab order and exclude them from tree arrow navigation.
- Announce loading and failure states with status semantics.

## Showcase

The `/tree` showcase and home card demonstrate:

- text label and text content
- projected label and projected content
- text label with projected content
- projected label with text content
- data-backed nodes with keyed template overrides
- mixed data/projected ordering
- Promise lazy loading with success, initial failure, and retry
- Observable lazy loading through the first emission
- Signal lazy loading from `null` to a child array
- disabled nodes, selection/activation feedback, and RTL keyboard behavior

Each visual example includes a matching hand-authored standalone snippet through `ShowcaseCode`
from `src/app/shared/showcase-code`.

## Acceptance Criteria

- All intentional tree APIs and types are exported from the feature and top-level barrels.
- Text and projected label/content combinations resolve with documented precedence.
- Data and projected nodes share one selection, expansion, activation, focus, and ordering model.
- Lazy loading caches success, prevents duplicate work, handles empty results, and supports retry.
- Keyboard navigation, focus restoration, disabled behavior, ARIA state, and RTL mirroring work.
- Styling uses existing tokens, logical properties, and established icon utilities.
- The `/tree` showcase and matching copyable snippets are available.
- The Angular build succeeds without adding or updating tests.
