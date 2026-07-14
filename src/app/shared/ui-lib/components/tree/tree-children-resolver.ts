import {
  DestroyRef,
  EffectRef,
  Injectable,
  Injector,
  effect,
  inject,
  isSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom, isObservable } from 'rxjs';

import type { TreeChildrenSignal, TreeChildrenSource, TreeNode } from './tree-types';

@Injectable()
export class TreeChildrenResolver {
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  resolve<T>(source: TreeChildrenSource<T>): Promise<readonly TreeNode<T>[]> {
    if (isSignal(source)) {
      return this.resolveSignal(source);
    }

    if (isObservable(source)) {
      return firstValueFrom(source.pipe(takeUntilDestroyed(this.destroyRef)));
    }

    return source;
  }

  private resolveSignal<T>(source: TreeChildrenSignal<T>): Promise<readonly TreeNode<T>[]> {
    return new Promise((resolve, reject) => {
      let effectRef: EffectRef | null = null;
      let unregisterDestroy = (): void => undefined;
      let settled = false;

      const finish = (callback: () => void): void => {
        if (settled) {
          return;
        }

        settled = true;
        callback();
        queueMicrotask(() => {
          effectRef?.destroy();
          unregisterDestroy();
        });
      };

      effectRef = effect(
        () => {
          try {
            const children = source();

            if (children !== null) {
              finish(() => resolve(children));
            }
          } catch (error) {
            finish(() => reject(error));
          }
        },
        { injector: this.injector, manualCleanup: true },
      );

      unregisterDestroy = this.destroyRef.onDestroy(() => effectRef?.destroy());
    });
  }
}
