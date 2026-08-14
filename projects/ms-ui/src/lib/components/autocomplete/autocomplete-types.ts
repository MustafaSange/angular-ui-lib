import type { TemplateRef } from '@angular/core';
import type { Observable } from 'rxjs';

export type AutocompleteAsyncResult<TValue> =
  | readonly AutocompleteOption<TValue>[]
  | Promise<readonly AutocompleteOption<TValue>[]>
  | Observable<readonly AutocompleteOption<TValue>[]>;

export type AutocompleteSearchSource<TValue> =
  | readonly AutocompleteOption<TValue>[]
  | ((query: string) => AutocompleteAsyncResult<TValue>);

export interface AutocompleteOption<TValue> {
  readonly label: string;
  readonly value: TValue;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly icon?: string;
  readonly group?: string;
  readonly template?: TemplateRef<void>;
}

export type AutocompleteCompareWith<TValue> = (a: TValue, b: TValue) => boolean;
export type AutocompleteDisplayWith<TValue> = (value: TValue) => string;
export type AutocompleteValueSerializer<TValue> = (value: TValue) => string;
