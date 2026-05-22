import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-showcase-code',
  templateUrl: './showcase-code.html',
  styleUrl: './showcase-code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseCode {
  readonly code = input.required<string>();
  readonly label = input('Example');
  readonly language = input('ts');

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

  private setCopyState(state: 'copied' | 'failed'): void {
    this.copyState.set(state);

    if (this.copyResetId) {
      clearTimeout(this.copyResetId);
    }

    this.copyResetId = setTimeout(() => {
      this.copyState.set('idle');
    }, 2000);
  }
}
