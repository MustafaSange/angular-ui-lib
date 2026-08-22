import { computed, Service, signal } from '@angular/core';

@Service()
export class LoadingService {
  private readonly activeCountState = signal(0);

  readonly activeCount = this.activeCountState.asReadonly();
  readonly isLoading = computed(() => this.activeCountState() > 0);

  begin(): void {
    this.activeCountState.update((count) => count + 1);
  }

  end(): void {
    this.activeCountState.update((count) => Math.max(0, count - 1));
  }
}
