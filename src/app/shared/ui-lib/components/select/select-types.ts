import type { TemplateRef } from '@angular/core';
import type { Observable } from 'rxjs';

export type SelectAsyncResult<TValue> =
  | readonly SelectOption<TValue>[]
  | Promise<readonly SelectOption<TValue>[]>
  | Observable<readonly SelectOption<TValue>[]>;

export type SelectSearchSource<TValue> =
  | readonly SelectOption<TValue>[]
  | ((query: string) => SelectAsyncResult<TValue>);

export interface SelectOption<TValue> {
  readonly label: string;
  readonly value: TValue;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly icon?: string;
  readonly group?: string;
  readonly template?: TemplateRef<void>;
}

export type SelectCompareWith<TValue> = (a: TValue, b: TValue) => boolean;
export type SelectDisplayWith<TValue> = (value: TValue) => string;
export type SelectValueSerializer<TValue> = (value: TValue) => string;
