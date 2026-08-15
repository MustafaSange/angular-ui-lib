import { Service } from '@angular/core';

import type { CopyClipboardResult } from '../components/copy-button/copy-button-types';
import {
  TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR,
  type TableClipboardOptions,
} from './table-clipboard-types';

type TableSectionName = 'thead' | 'tbody' | 'tfoot';
type TableCellName = 'th' | 'td';

interface ExtractedTableCell {
  readonly name: TableCellName;
  readonly text: string;
  readonly colSpan: number;
  readonly rowSpan: number;
  readonly scope: string | null;
}

interface ExtractedTableRow {
  readonly cells: readonly ExtractedTableCell[];
  readonly section: TableSectionName;
}

@Service()
export class TableClipboardService {
  async copyTable(
    table: HTMLTableElement,
    options?: TableClipboardOptions,
  ): Promise<CopyClipboardResult> {
    try {
      const excludeSelector = this.resolveExcludeSelector(options);
      this.validateSelector(table, excludeSelector);

      const rows = Array.from(table.rows)
        .map((row) => this.extractRow(row, excludeSelector))
        .filter((row): row is ExtractedTableRow => row !== null);

      return await this.writeTableClipboard(
        this.serializeText(rows),
        this.serializeTableHtml(rows),
      );
    } catch {
      return 'failed';
    }
  }

  async copyRow(
    row: HTMLTableRowElement,
    options?: TableClipboardOptions,
  ): Promise<CopyClipboardResult> {
    try {
      const excludeSelector = this.resolveExcludeSelector(options);
      this.validateSelector(row, excludeSelector);
      const extractedRow = this.extractRow(row, excludeSelector);

      if (extractedRow === null) {
        return 'failed';
      }

      return await this.writeTableClipboard(
        this.serializeText([extractedRow]),
        `<table><tbody>${this.serializeRowHtml(extractedRow)}</tbody></table>`,
      );
    } catch {
      return 'failed';
    }
  }

  private extractRow(
    row: HTMLTableRowElement,
    excludeSelector: string | null,
  ): ExtractedTableRow | null {
    if (excludeSelector !== null && row.matches(excludeSelector)) {
      return null;
    }

    const cells = Array.from(row.cells)
      .filter((cell) => excludeSelector === null || !cell.matches(excludeSelector))
      .map((cell) => this.extractCell(cell, excludeSelector));

    return cells.length === 0
      ? null
      : {
          cells,
          section: this.resolveSection(row),
        };
  }

  private extractCell(
    cell: HTMLTableCellElement,
    excludeSelector: string | null,
  ): ExtractedTableCell {
    const clone = cell.cloneNode(true) as HTMLTableCellElement;

    if (excludeSelector !== null) {
      clone.querySelectorAll(excludeSelector).forEach((element) => element.remove());
    }

    return {
      name: cell.tagName === 'TH' ? 'th' : 'td',
      text: (clone.textContent ?? '')
        .replace(/\u00a0/gu, ' ')
        .replace(/\s+/gu, ' ')
        .trim(),
      colSpan: cell.colSpan,
      rowSpan: cell.rowSpan,
      scope: cell.tagName === 'TH' ? cell.getAttribute('scope') : null,
    };
  }

  private serializeText(rows: readonly ExtractedTableRow[]): string {
    return rows
      .map((row) => row.cells.map((cell) => cell.text).join('\t'))
      .join('\n')
      .replace(/\n+$/u, '');
  }

  private serializeTableHtml(rows: readonly ExtractedTableRow[]): string {
    let html = '<table>';
    let openSection: TableSectionName | null = null;

    for (const row of rows) {
      if (row.section !== openSection) {
        if (openSection !== null) {
          html += `</${openSection}>`;
        }

        openSection = row.section;
        html += `<${openSection}>`;
      }

      html += this.serializeRowHtml(row);
    }

    if (openSection !== null) {
      html += `</${openSection}>`;
    }

    return `${html}</table>`;
  }

  private serializeRowHtml(row: ExtractedTableRow): string {
    const cells = row.cells.map((cell) => this.serializeCellHtml(cell)).join('');
    return `<tr>${cells}</tr>`;
  }

  private serializeCellHtml(cell: ExtractedTableCell): string {
    const attributes: string[] = [];

    if (cell.colSpan !== 1) {
      attributes.push(`colspan="${cell.colSpan}"`);
    }

    if (cell.rowSpan !== 1) {
      attributes.push(`rowspan="${cell.rowSpan}"`);
    }

    if (cell.scope !== null) {
      attributes.push(`scope="${this.escapeHtml(cell.scope)}"`);
    }

    const attributeText = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
    return `<${cell.name}${attributeText}>${this.escapeHtml(cell.text)}</${cell.name}>`;
  }

  private resolveSection(row: HTMLTableRowElement): TableSectionName {
    const sectionName = row.parentElement?.tagName.toLowerCase();

    return sectionName === 'thead' || sectionName === 'tfoot' ? sectionName : 'tbody';
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/gu, '&amp;')
      .replace(/</gu, '&lt;')
      .replace(/>/gu, '&gt;')
      .replace(/"/gu, '&quot;');
  }

  private async writeTableClipboard(text: string, html: string): Promise<CopyClipboardResult> {
    if (text.trim().length === 0 || typeof navigator === 'undefined') {
      return 'failed';
    }

    const clipboard = navigator.clipboard;

    if (
      typeof ClipboardItem !== 'undefined' &&
      typeof Blob !== 'undefined' &&
      typeof clipboard?.write === 'function'
    ) {
      try {
        await clipboard.write([
          new ClipboardItem({
            'text/plain': new Blob([text], { type: 'text/plain' }),
            'text/html': new Blob([html], { type: 'text/html' }),
          }),
        ]);
        return 'copied';
      } catch {
        // Fall through to plain text when rich clipboard writing is rejected.
      }
    }

    try {
      await clipboard.writeText(text);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  private resolveExcludeSelector(options?: TableClipboardOptions): string | null {
    return options?.excludeSelector === undefined
      ? TABLE_CLIPBOARD_DEFAULT_EXCLUDE_SELECTOR
      : options.excludeSelector;
  }

  private validateSelector(element: Element, excludeSelector: string | null): void {
    if (excludeSelector !== null) {
      element.matches(excludeSelector);
    }
  }
}
