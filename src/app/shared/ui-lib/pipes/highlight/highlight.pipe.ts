import { Pipe, PipeTransform } from '@angular/core';

import { HighlightPart } from './highlight.types';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    searchText: string | null | undefined,
  ): HighlightPart[] {
    if (!value) {
      return [];
    }

    const search = searchText?.trim();

    if (!search) {
      return [{ text: value, match: false }];
    }

    const pattern = new RegExp(this.escapeRegExp(search), 'gi');
    const parts: HighlightPart[] = [];
    let cursor = 0;
    let match = pattern.exec(value);

    while (match) {
      if (match.index > cursor) {
        parts.push({
          text: value.slice(cursor, match.index),
          match: false,
        });
      }

      const matchedText = match[0];

      parts.push({ text: matchedText, match: true });
      cursor = match.index + matchedText.length;
      match = pattern.exec(value);
    }

    if (cursor < value.length) {
      parts.push({ text: value.slice(cursor), match: false });
    }

    return parts;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
