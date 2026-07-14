import { Component, computed, input, signal } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'app-showcase-code',
  templateUrl: './showcase-code.html',
  styleUrl: './showcase-code.scss',
})
export class ShowcaseCode {
  readonly code = input.required<string>();
  readonly label = input('Example');
  readonly language = input('ts');

  protected readonly highlightedCode = computed(() => {
    const language = this.normalizedLanguage();
    const grammar = Prism.languages[language];

    if (!grammar) {
      return this.escapeHtml(this.code());
    }

    return Prism.highlight(this.code(), grammar, language);
  });

  protected readonly isExpanded = signal(false);
  protected readonly copyState = signal<'idle' | 'copied' | 'failed'>('idle');

  private copyResetId: ReturnType<typeof setTimeout> | undefined;

  protected async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.setCopyState('copied');
    } catch {
      this.setCopyState('failed');
    }
  }

  protected toggleExpanded(): void {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  private setCopyState(state: 'copied' | 'failed'): void {
    this.copyState.set(state);

    if (this.copyResetId) {
      clearTimeout(this.copyResetId);
    }

    this.copyResetId = setTimeout(() => {
      this.copyState.set('idle');
    }, 2000);
  }

  private normalizedLanguage(): string {
    switch (this.language().toLowerCase()) {
      case 'ts':
      case 'typescript':
        return 'typescript';
      case 'html':
      case 'markup':
        return 'markup';
      case 'js':
      case 'javascript':
        return 'javascript';
      default:
        return this.language().toLowerCase();
    }
  }

  private escapeHtml(code: string): string {
    return code
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
