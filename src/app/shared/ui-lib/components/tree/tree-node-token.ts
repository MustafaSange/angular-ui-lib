import { InjectionToken } from '@angular/core';

import type { TreeNodeComponent } from './tree-node';

export const TREE_NODE = new InjectionToken<TreeNodeComponent>('TREE_NODE');
