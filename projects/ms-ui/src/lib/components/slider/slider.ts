import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  numberAttribute,
  output,
  viewChild,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'ms-slider',
  templateUrl: './slider.html',
  host: {
    class: 'slider',
    '[class.is-disabled]': 'disabled()',
    '[style.--_slider-percent]': 'sliderPercent()',
  },
})
export class SliderComponent implements FormValueControl<number> {
  private readonly rangeInput = viewChild<ElementRef<HTMLInputElement>>('range');

  readonly value = model(0);
  readonly min = input<number | undefined, unknown>(undefined, {
    transform: (value) => this.numberAttributeOrUndefined(value),
  });
  readonly max = input<number | undefined, unknown>(undefined, {
    transform: (value) => this.numberAttributeOrUndefined(value),
  });
  readonly step = input(1, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();
  readonly showValue = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

  protected readonly effectiveMin = computed(() =>
    Math.min(this.normalizedMin(), this.normalizedMax()),
  );
  protected readonly effectiveMax = computed(() =>
    Math.max(this.normalizedMin(), this.normalizedMax()),
  );
  protected readonly effectiveStep = computed(() => {
    const step = this.step();

    return Number.isFinite(step) && step > 0 ? step : 1;
  });
  protected readonly clampedValue = computed(() => this.clampValue(this.value()));
  protected readonly sliderPercent = computed(() => {
    const min = this.effectiveMin();
    const max = this.effectiveMax();

    if (min === max) {
      return '0%';
    }

    return `${((this.clampedValue() - min) / (max - min)) * 100}%`;
  });

  constructor() {
    effect(() => {
      const value = this.value();
      const clampedValue = this.clampValue(value);

      if (value !== clampedValue) {
        this.value.set(clampedValue);
      }
    });
  }

  protected updateValue(value: number): void {
    this.value.set(this.clampValue(value));
  }

  focus(options?: FocusOptions): void {
    this.rangeInput()?.nativeElement.focus(options);
  }

  private normalizedMin(): number {
    const min = this.min();

    return typeof min === 'number' && Number.isFinite(min) ? min : 0;
  }

  private normalizedMax(): number {
    const max = this.max();

    return typeof max === 'number' && Number.isFinite(max) ? max : 100;
  }

  private numberAttributeOrUndefined(value: unknown): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    const numericValue = numberAttribute(value);

    return Number.isFinite(numericValue) ? numericValue : undefined;
  }

  private clampValue(value: number): number {
    const min = this.effectiveMin();
    const max = this.effectiveMax();
    const normalizedValue = Number.isFinite(value) ? value : min;

    return Math.min(Math.max(normalizedValue, min), max);
  }
}
