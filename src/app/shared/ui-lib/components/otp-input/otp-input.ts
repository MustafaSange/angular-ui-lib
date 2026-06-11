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
  viewChildren,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

import type { OtpInputMode } from './otp-input-types';

const MIN_OTP_LENGTH = 1;
const MAX_OTP_LENGTH = 12;

let nextOtpInputId = 0;

@Component({
  selector: 'ms-otp-input',
  templateUrl: './otp-input.html',
  host: {
    class: 'otp-input',
    '[class.is-disabled]': 'disabled()',
    '[class.is-readonly]': 'readonly()',
    '[attr.formField]': 'true',
  },
})
export class OtpInputComponent implements FormValueControl<string> {
  private readonly inputRefs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');
  private readonly generatedId = `ms-otp-input-${nextOtpInputId++}`;
  private interacted = false;

  readonly value = model('');
  readonly length = input(6, { transform: numberAttribute });
  readonly mode = input<OtpInputMode>('numeric');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly id = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });
  readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });
  readonly complete = output<string>();
  readonly touch = output<void>();

  protected readonly effectiveLength = computed(() =>
    Math.min(Math.max(Math.trunc(this.length()), MIN_OTP_LENGTH), MAX_OTP_LENGTH),
  );
  protected readonly slotIndexes = computed(() =>
    Array.from({ length: this.effectiveLength() }, (_, index) => index),
  );
  protected readonly slots = computed(() => {
    const value = this.value();

    return this.slotIndexes().map((index) => value[index] ?? '');
  });
  protected readonly inputMode = computed(() =>
    this.normalizedMode() === 'numeric' ? 'numeric' : 'text',
  );
  protected readonly inputPattern = computed(() =>
    this.normalizedMode() === 'numeric' ? '[0-9]*' : '[A-Za-z0-9]*',
  );

  constructor() {
    effect(() => {
      const value = this.value();
      const normalizedValue = this.normalizeValue(value);

      if (value !== normalizedValue) {
        this.value.set(normalizedValue);
      }
    });
  }

  focus(options?: FocusOptions): void {
    this.focusInput(this.nextEditableIndex(), options);
  }

  reset(): void {
    this.interacted = false;
    this.value.set('');
    this.focusInput(0);
  }

  protected inputId(index: number): string {
    return `${this.id() ?? this.generatedId}-${index}`;
  }

  protected ariaLabelFor(index: number): string | null {
    if (this.ariaLabelledby()) {
      return null;
    }

    const label = this.ariaLabel() ?? 'One-time code';

    return `${label} character ${index + 1} of ${this.effectiveLength()}`;
  }

  protected handleInput(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const characters = this.filterCharacters(inputElement.value);

    if (characters.length === 0) {
      this.setCharacter(index, '', true);
      inputElement.value = this.slots()[index] ?? '';
      return;
    }

    this.applyCharacters(index, characters, true);
  }

  protected handleKeydown(index: number, event: KeyboardEvent): void {
    if (this.isEditingDisabled()) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.handleBackspace(index);
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      this.setCharacter(index, '', true);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusInput(index + 1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.focusInput(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.focusInput(this.effectiveLength() - 1);
      return;
    }

    if (event.key.length !== 1) {
      return;
    }

    const characters = this.filterCharacters(event.key);

    if (characters.length === 0) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    this.applyCharacters(index, characters, true);
  }

  protected handlePaste(index: number, event: ClipboardEvent): void {
    if (this.isEditingDisabled()) {
      return;
    }

    event.preventDefault();
    this.applyCharacters(
      index,
      this.filterCharacters(event.clipboardData?.getData('text') ?? ''),
      true,
    );
  }

  protected handleFocus(index: number, event: FocusEvent): void {
    const editableIndex = this.nextEditableIndex();

    if (index > editableIndex) {
      this.focusInput(editableIndex);
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }

  protected handleBlur(event: FocusEvent): void {
    if (!this.interacted) {
      return;
    }

    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && this.hostContains(nextTarget)) {
      return;
    }

    this.touch.emit();
  }

  private handleBackspace(index: number): void {
    if (this.slots()[index]) {
      this.setCharacter(index, '', true);
      return;
    }

    const previousIndex = Math.max(index - 1, 0);
    this.setCharacter(previousIndex, '', true);
    this.focusInput(previousIndex);
  }

  private applyCharacters(index: number, characters: string, emitComplete: boolean): void {
    if (!characters) {
      return;
    }

    const startIndex = Math.min(index, this.nextEditableIndex());
    const slots = this.slots();
    const effectiveLength = this.effectiveLength();

    for (
      let offset = 0;
      offset < characters.length && startIndex + offset < effectiveLength;
      offset += 1
    ) {
      slots[startIndex + offset] = characters[offset] ?? '';
    }

    this.setValue(slots.join(''), emitComplete);
    this.focusInput(Math.min(startIndex + characters.length, effectiveLength - 1));
  }

  private setCharacter(index: number, character: string, emitComplete: boolean): void {
    const slots = this.slots();
    slots[index] = character;
    this.setValue(slots.join(''), emitComplete);
  }

  private setValue(value: string, emitComplete: boolean): void {
    const previousValue = this.value();
    const nextValue = this.normalizeValue(value);

    this.interacted = true;
    this.value.set(nextValue);

    if (
      emitComplete &&
      nextValue.length === this.effectiveLength() &&
      nextValue !== previousValue
    ) {
      this.complete.emit(nextValue);
    }
  }

  private normalizeValue(value: string): string {
    return this.filterCharacters(value).slice(0, this.effectiveLength());
  }

  private filterCharacters(value: string): string {
    const normalizedValue = this.normalizedMode() === 'alphanumeric' ? value.toUpperCase() : value;
    const pattern = this.normalizedMode() === 'numeric' ? /[0-9]/g : /[A-Z0-9]/g;

    return normalizedValue.match(pattern)?.join('') ?? '';
  }

  private normalizedMode(): OtpInputMode {
    return this.mode() === 'alphanumeric' ? 'alphanumeric' : 'numeric';
  }

  private nextEditableIndex(): number {
    const valueLength = this.value().length;

    return Math.min(valueLength, this.effectiveLength() - 1);
  }

  private focusInput(index: number, options?: FocusOptions): void {
    const inputs = this.inputRefs();
    const targetIndex = Math.min(Math.max(index, 0), this.effectiveLength() - 1);
    const input = inputs[targetIndex]?.nativeElement;

    input?.focus(options);
    input?.select();
  }

  private isEditingDisabled(): boolean {
    return this.disabled() || this.readonly();
  }

  private hostContains(node: Node): boolean {
    return this.inputRefs().some((input) => input.nativeElement === node);
  }
}
