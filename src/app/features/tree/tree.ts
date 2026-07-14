import { Component, type Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type Observable, delay, of } from 'rxjs';

import {
  BadgeComponent,
  TreeComponent,
  TreeNode,
  TreeNodeComponent,
  TreeNodeContentDirective,
  TreeNodeContentForDirective,
  TreeNodeLabelDirective,
  TreeNodeLabelForDirective,
} from '../../shared/ui-lib';
import { ShowcaseCode } from '../../shared/showcase-code';

type ProjectNodeData = {
  owner: string;
};

@Component({
  selector: 'app-tree',
  imports: [
    RouterLink,
    ShowcaseCode,
    TreeComponent,
    TreeNodeComponent,
    TreeNodeLabelDirective,
    TreeNodeContentDirective,
    TreeNodeLabelForDirective,
    TreeNodeContentForDirective,
    BadgeComponent,
  ],
  templateUrl: './tree.html',
  styleUrl: './tree.scss',
})
export class Tree {
  private lazyAttempts = 0;

  protected readonly textExpandedIds = signal<ReadonlySet<string>>(new Set(['workspace']));
  protected readonly projectionExpandedIds = signal<ReadonlySet<string>>(
    new Set(['projected-favorites', 'text-label']),
  );
  protected readonly dataExpandedIds = signal<ReadonlySet<string>>(new Set(['reports']));
  protected readonly lazyExpandedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly observableExpandedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly signalExpandedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly rtlExpandedIds = signal<ReadonlySet<string>>(new Set(['rtl-workspace']));
  protected readonly selectedId = signal<string | null>('recent');
  protected readonly activatedNode = signal('None');

  protected readonly dataNodes: readonly TreeNode<ProjectNodeData>[] = [
    {
      id: 'reports',
      label: 'Reports',
      icon: 'folder',
      content: 'Operational reports shared with workspace administrators.',
      data: { owner: 'Operations' },
      children: [
        { id: 'weekly', label: 'Weekly summary', icon: 'description', data: { owner: 'Mariam' } },
        { id: 'audit', label: 'Audit log', icon: 'description', data: { owner: 'Security' } },
      ],
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: 'folder',
      disabled: true,
      data: { owner: 'Records' },
    },
  ];

  protected readonly lazyNodes: readonly TreeNode[] = [
    { id: 'services', label: 'Services', icon: 'folder', hasChildren: true },
    { id: 'failed-jobs', label: 'Failed jobs', icon: 'folder', hasChildren: true },
  ];
  protected readonly observableNodes: readonly TreeNode[] = [
    { id: 'observable-teams', label: 'Teams', icon: 'folder', hasChildren: true },
  ];
  protected readonly signalNodes: readonly TreeNode[] = [
    { id: 'signal-regions', label: 'Regions', icon: 'folder', hasChildren: true },
  ];

  protected activateNode(node: TreeNode): void {
    this.activatedNode.set(node.label);
  }

  protected expandedIdsLabel(ids: ReadonlySet<string>): string {
    return [...ids].join(', ') || 'None';
  }

  protected readonly loadChildren = async (node: TreeNode): Promise<readonly TreeNode[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 650));

    if (node.id === 'failed-jobs' && this.lazyAttempts++ === 0) {
      throw new Error('Showcase loading failure');
    }

    return node.id === 'services'
      ? [
          { id: 'identity-api', label: 'Identity API', icon: 'settings' },
          { id: 'billing-api', label: 'Billing API', icon: 'settings' },
        ]
      : [{ id: 'job-1042', label: 'Job 1042', icon: 'description' }];
  };

  protected readonly loadObservableChildren = (node: TreeNode): Observable<readonly TreeNode[]> =>
    of(
      node.id === 'observable-teams'
        ? [
            { id: 'design-team', label: 'Design', icon: 'folder' },
            { id: 'engineering-team', label: 'Engineering', icon: 'folder' },
          ]
        : [],
    ).pipe(delay(650));

  protected readonly loadSignalChildren = (node: TreeNode): Signal<readonly TreeNode[] | null> => {
    const children = signal<readonly TreeNode[] | null>(null);

    setTimeout(() => {
      children.set(
        node.id === 'signal-regions'
          ? [
              { id: 'doha-region', label: 'Doha', icon: 'folder' },
              { id: 'dubai-region', label: 'Dubai', icon: 'folder' },
            ]
          : [],
      );
    }, 650);

    return children.asReadonly();
  };

  protected readonly textSnippet = `import { Component, signal } from '@angular/core';

import { TreeComponent, TreeNode, TreeNodeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-text-tree-example',
  imports: [TreeComponent, TreeNodeComponent],
  template: \`
    <ms-tree
      ariaLabel="Workspace files"
      [(selectedId)]="selectedId"
      [(expandedIds)]="expandedIds"
      (nodeActivate)="activateNode($event)"
    >
      <ms-tree-node
        nodeId="workspace"
        label="Workspace"
        content="Files available to everyone in this workspace."
        icon="folder"
      >
        <ms-tree-node nodeId="recent" label="Recent files" icon="description" />
        <ms-tree-node nodeId="shared" label="Shared files" icon="folder" />
      </ms-tree-node>
    </ms-tree>

    <div aria-live="polite">
      <span>Selected: {{ selectedId() ?? 'None' }}</span>
      <span>Expanded: {{ expandedIdsLabel(expandedIds()) }}</span>
      <span>Activated: {{ activatedNode() }}</span>
    </div>
  \`,
})
export class TextTreeExample {
  protected readonly selectedId = signal<string | null>('recent');
  protected readonly expandedIds = signal<ReadonlySet<string>>(new Set(['workspace']));
  protected readonly activatedNode = signal('None');

  protected activateNode(node: TreeNode): void {
    this.activatedNode.set(node.label);
  }

  protected expandedIdsLabel(ids: ReadonlySet<string>): string {
    return [...ids].join(', ') || 'None';
  }
}`;

  protected readonly projectionSnippet = `import { Component, signal } from '@angular/core';

import {
  BadgeComponent,
  TreeComponent,
  TreeNodeComponent,
  TreeNodeContentDirective,
  TreeNodeLabelDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-projected-tree-example',
  imports: [
    TreeComponent,
    TreeNodeComponent,
    TreeNodeLabelDirective,
    TreeNodeContentDirective,
    BadgeComponent,
  ],
  template: \`
    <ms-tree ariaLabel="Favorite files" [(expandedIds)]="expandedIds">
      <ms-tree-node
        nodeId="projected-favorites"
        ariaLabel="Favorites, 4 items"
        icon="favorite"
      >
        <span msTreeNodeLabel>Favorites <ms-badge>4</ms-badge></span>
        <div msTreeNodeContent>
          <p>Recently pinned project files.</p>
          <button class="btn btn-secondary btn-sm" type="button">Manage favorites</button>
        </div>
      </ms-tree-node>

      <ms-tree-node nodeId="text-label" label="Team files" icon="folder">
        <div msTreeNodeContent>Files shared by your project team.</div>
      </ms-tree-node>

      <ms-tree-node
        nodeId="projected-label"
        content="Three files need review."
        ariaLabel="Needs review, 3 items"
      >
        <span msTreeNodeLabel>Needs review <ms-badge kind="warning">3</ms-badge></span>
      </ms-tree-node>
    </ms-tree>
  \`,
})
export class ProjectedTreeExample {
  protected readonly expandedIds = signal<ReadonlySet<string>>(
    new Set(['projected-favorites', 'text-label']),
  );
}`;

  protected readonly dataSnippet = `import { Component, signal } from '@angular/core';

import {
  BadgeComponent,
  TreeComponent,
  TreeNode,
  TreeNodeComponent,
  TreeNodeContentForDirective,
  TreeNodeLabelForDirective,
} from './shared/ui-lib';

@Component({
  selector: 'app-data-tree-example',
  imports: [
    TreeComponent,
    TreeNodeComponent,
    TreeNodeLabelForDirective,
    TreeNodeContentForDirective,
    BadgeComponent,
  ],
  template: \`
    <ms-tree
      ariaLabel="Project resources"
      [nodes]="nodes"
      mixedOrder="data-first"
      [(expandedIds)]="expandedIds"
    >
      <ng-template msTreeNodeLabelFor="reports" let-node>
        <span>{{ node.label }}</span>
        <ms-badge>{{ node.data?.owner }}</ms-badge>
      </ng-template>

      <ng-template msTreeNodeContentFor="reports" let-node>
        Maintained by {{ node.data?.owner }}.
      </ng-template>

      <ms-tree-node nodeId="pinned" label="Pinned resources" icon="favorite" />
    </ms-tree>
  \`,
})
export class DataTreeExample {
  protected readonly expandedIds = signal<ReadonlySet<string>>(new Set(['reports']));
  protected readonly nodes: readonly TreeNode<{ owner: string }>[] = [
    {
      id: 'reports',
      label: 'Reports',
      icon: 'folder',
      content: 'Operational reports shared with workspace administrators.',
      data: { owner: 'Operations' },
      children: [
        {
          id: 'weekly',
          label: 'Weekly summary',
          icon: 'description',
          data: { owner: 'Mariam' },
        },
        {
          id: 'audit',
          label: 'Audit log',
          icon: 'description',
          data: { owner: 'Security' },
        },
      ],
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: 'folder',
      disabled: true,
      data: { owner: 'Records' },
    },
  ];
}`;

  protected readonly lazySnippet = `import { Component, signal } from '@angular/core';

import { TreeComponent, TreeNode } from './shared/ui-lib';

@Component({
  selector: 'app-lazy-tree-example',
  imports: [TreeComponent],
  template: \`
    <ms-tree
      ariaLabel="Service resources"
      [nodes]="nodes"
      [loadChildren]="loadChildren"
      loadingText="Fetching services…"
      loadErrorText="Services are temporarily unavailable."
      retryText="Try again"
      [(expandedIds)]="expandedIds"
    />
  \`,
})
export class LazyTreeExample {
  private lazyAttempts = 0;

  protected readonly expandedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly nodes: readonly TreeNode[] = [
    { id: 'services', label: 'Services', icon: 'folder', hasChildren: true },
    { id: 'failed-jobs', label: 'Failed jobs', icon: 'folder', hasChildren: true },
  ];

  protected readonly loadChildren = async (node: TreeNode): Promise<readonly TreeNode[]> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 650));

    if (node.id === 'failed-jobs' && this.lazyAttempts++ === 0) {
      throw new Error('Showcase loading failure');
    }

    return node.id === 'services'
      ? [
          { id: 'identity-api', label: 'Identity API', icon: 'settings' },
          { id: 'billing-api', label: 'Billing API', icon: 'settings' },
        ]
      : [{ id: 'job-1042', label: 'Job 1042', icon: 'description' }];
  };
}`;

  protected readonly observableSnippet = `import { Component, signal } from '@angular/core';
import { type Observable, delay, of } from 'rxjs';

import { TreeComponent, TreeNode } from './shared/ui-lib';

@Component({
  selector: 'app-observable-tree-example',
  imports: [TreeComponent],
  template: \`
    <ms-tree
      ariaLabel="Observable teams"
      [nodes]="nodes"
      [loadChildren]="loadChildren"
      [(expandedIds)]="expandedIds"
    />
  \`,
})
export class ObservableTreeExample {
  protected readonly expandedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly nodes: readonly TreeNode[] = [
    { id: 'observable-teams', label: 'Teams', icon: 'folder', hasChildren: true },
  ];

  protected readonly loadChildren = (node: TreeNode): Observable<readonly TreeNode[]> =>
    of(
      node.id === 'observable-teams'
        ? [
            { id: 'design-team', label: 'Design', icon: 'folder' },
            { id: 'engineering-team', label: 'Engineering', icon: 'folder' },
          ]
        : [],
    ).pipe(delay(650));
}`;

  protected readonly signalSnippet = `import { Component, type Signal, signal } from '@angular/core';

import { TreeComponent, TreeNode } from './shared/ui-lib';

@Component({
  selector: 'app-signal-tree-example',
  imports: [TreeComponent],
  template: \`
    <ms-tree
      ariaLabel="Signal regions"
      [nodes]="nodes"
      [loadChildren]="loadChildren"
      [(expandedIds)]="expandedIds"
    />
  \`,
})
export class SignalTreeExample {
  protected readonly expandedIds = signal<ReadonlySet<string>>(new Set());
  protected readonly nodes: readonly TreeNode[] = [
    { id: 'signal-regions', label: 'Regions', icon: 'folder', hasChildren: true },
  ];

  protected readonly loadChildren = (
    node: TreeNode,
  ): Signal<readonly TreeNode[] | null> => {
    const children = signal<readonly TreeNode[] | null>(null);

    setTimeout(() => {
      children.set(
        node.id === 'signal-regions'
          ? [
              { id: 'doha-region', label: 'Doha', icon: 'folder' },
              { id: 'dubai-region', label: 'Dubai', icon: 'folder' },
            ]
          : [],
      );
    }, 650);

    return children.asReadonly();
  };
}`;

  protected readonly rtlSnippet = `import { Component, signal } from '@angular/core';

import { TreeComponent, TreeNodeComponent } from './shared/ui-lib';

@Component({
  selector: 'app-rtl-tree-example',
  imports: [TreeComponent, TreeNodeComponent],
  template: \`
    <div dir="rtl">
      <ms-tree ariaLabel="ملفات المشروع" [(expandedIds)]="expandedIds">
        <ms-tree-node nodeId="rtl-workspace" label="مساحة العمل" icon="folder">
          <ms-tree-node nodeId="rtl-documents" label="المستندات" icon="description" />
          <ms-tree-node nodeId="rtl-archive" label="الأرشيف" icon="folder" disabled />
        </ms-tree-node>
      </ms-tree>
    </div>
  \`,
})
export class RtlTreeExample {
  protected readonly expandedIds = signal<ReadonlySet<string>>(new Set(['rtl-workspace']));
}`;
}
