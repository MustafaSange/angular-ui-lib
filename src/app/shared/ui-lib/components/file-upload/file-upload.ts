import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { FormValueControl, ValidationError } from '@angular/forms/signals';

import type {
  FileUploadConfig,
  FileUploadItem,
  FileUploadValidationError,
  FileUploadValidationReason,
  FileUploadValue,
} from './file-upload-types';
import { ChipComponent, ChipRemoveDirective } from '../chip';

type SanitizedFileName =
  | {
      readonly valid: true;
      readonly safeName: string;
      readonly extension: string;
    }
  | {
      readonly valid: false;
      readonly error: FileUploadValidationError;
    };

const UNSAFE_CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
const UNSAFE_FILENAME_CHARACTERS = /[^a-zA-Z0-9._ -]/g;
const REPEATED_SPACES = /\s+/g;
const REPEATED_DOTS = /\.{2,}/g;
let nextFileUploadId = 0;

@Component({
  selector: 'ms-file-upload',
  imports: [ChipComponent, ChipRemoveDirective],
  templateUrl: './file-upload.html',
  host: {
    class: 'file-upload',
    '[class.is-disabled]': 'isDisabled()',
    '[class.is-readonly]': 'isReadonly()',
    '[class.is-drag-active]': 'isDragActive()',
    '[class.is-invalid]': 'invalid() && (touched() || dirty())',
    '[attr.formField]': 'true',
  },
})
export class FileUploadComponent implements FormValueControl<FileUploadValue> {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private readonly generatedId = `ms-file-upload-${nextFileUploadId++}`;

  readonly value = model<FileUploadValue>(null);
  readonly config = input<FileUploadConfig>({});
  readonly id = input<string | null>(null);
  readonly name = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly dirty = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected readonly dragDepth = signal(0);
  protected readonly isDragActive = computed(
    () => this.isDraggable() && this.dragDepth() > 0 && !this.isInteractiveDisabled(),
  );
  protected readonly uploadInputId = computed(() => this.id() ?? this.generatedId);
  protected readonly descriptionId = computed(() => `${this.uploadInputId()}-description`);
  protected readonly multiple = computed(() => this.config().multiple ?? false);
  protected readonly isDraggable = computed(() => this.config().draggable ?? true);
  protected readonly isDisabled = computed(() => this.disabled() || this.config().disabled === true);
  protected readonly isReadonly = computed(() => this.readonly() || this.config().readonly === true);
  protected readonly isInteractiveDisabled = computed(() => this.isDisabled() || this.isReadonly());
  protected readonly acceptedExtensions = computed(() =>
    this.normalizeExtensions(this.config().allowedExtensions ?? []),
  );
  protected readonly accept = computed(() => {
    const extensions = this.acceptedExtensions();

    return extensions.length > 0 ? extensions.map((extension) => `.${extension}`).join(',') : null;
  });
  protected readonly items = computed(() => this.readItems(this.value()));
  protected readonly acceptedItems = computed(() =>
    this.items().filter((item) => item.errors.length === 0),
  );
  protected readonly hasItems = computed(() => this.acceptedItems().length > 0);
  protected readonly helperText = computed(() => {
    const extensions = this.acceptedExtensions();
    const maxFileSize = this.config().maxFileSizeBytes;
    const parts = [
      this.getPrimaryHelperText(),
      extensions.length > 0
        ? `Allowed: ${extensions.map((extension) => `.${extension}`).join(', ')}`
        : '',
      maxFileSize ? `Max ${this.formatFileSize(maxFileSize)}.` : '',
    ];

    return parts.filter(Boolean).join(' ');
  });

  openFileDialog(): void {
    if (this.isInteractiveDisabled()) {
      return;
    }

    this.fileInput()?.nativeElement.click();
  }

  focus(options?: FocusOptions): void {
    this.fileInput()?.nativeElement.focus(options);
  }

  reset(): void {
    this.dragDepth.set(0);
    this.value.set(this.multiple() ? [] : null);
    this.clearNativeInput();
  }

  protected handleInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.handleSelectedFiles(inputElement.files);
    this.clearNativeInput();
  }

  protected handleDragEnter(event: DragEvent): void {
    if (!this.isDraggable() || this.isInteractiveDisabled() || !this.hasDraggedFiles(event)) {
      return;
    }

    event.preventDefault();
    this.dragDepth.update((depth) => depth + 1);
  }

  protected handleDragOver(event: DragEvent): void {
    if (!this.isDraggable() || this.isInteractiveDisabled() || !this.hasDraggedFiles(event)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }

  protected handleDragLeave(event: DragEvent): void {
    if (!this.isDraggable() || this.isInteractiveDisabled() || !this.hasDraggedFiles(event)) {
      return;
    }

    event.preventDefault();
    this.dragDepth.update((depth) => Math.max(0, depth - 1));
  }

  protected handleDrop(event: DragEvent): void {
    if (!this.isDraggable() || this.isInteractiveDisabled()) {
      return;
    }

    event.preventDefault();
    this.dragDepth.set(0);
    this.handleSelectedFiles(event.dataTransfer?.files ?? null);
  }

  protected removeItem(itemToRemove: FileUploadItem): void {
    if (this.isInteractiveDisabled()) {
      return;
    }

    const nextItems = this.acceptedItems().filter((item) => item !== itemToRemove);
    this.value.set(this.multiple() ? nextItems : null);
    this.markTouched();
  }

  protected markTouched(): void {
    this.touch.emit();
  }

  protected formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  private handleSelectedFiles(fileList: FileList | null): void {
    const files = Array.from(fileList ?? []);

    if (files.length === 0) {
      return;
    }

    const currentItems = this.multiple() ? this.acceptedItems() : [];
    const acceptedItems: FileUploadItem[] = [];
    const rejectedItems: FileUploadItem[] = [];

    files.forEach((file, index) => {
      if (!this.multiple() && index > 0) {
        rejectedItems.push(
          this.createRejectedFileItem(
            file,
            this.createError('multiple', file.name, 'Only one file can be uploaded.'),
          ),
        );
        return;
      }

      const item = this.createFileItem(file, [...currentItems, ...acceptedItems]);

      if ('error' in item) {
        rejectedItems.push(this.createRejectedFileItem(file, item.error));
        return;
      }

      acceptedItems.push(item);
    });

    const nextItems = [...currentItems, ...acceptedItems, ...rejectedItems];

    if (nextItems.length > 0) {
      this.value.set(this.multiple() ? nextItems : nextItems[0]);
    }

    this.markTouched();
  }

  private getPrimaryHelperText(): string {
    if (this.isDraggable()) {
      return this.multiple() ? 'Choose or drop files.' : 'Choose or drop a file.';
    }

    return this.multiple() ? 'Choose files.' : 'Choose a file.';
  }

  private createFileItem(
    file: File,
    existingItems: readonly FileUploadItem[],
  ): FileUploadItem | { readonly error: FileUploadValidationError } {
    if (file.size <= 0) {
      return { error: this.createError('empty', file.name, 'File must be larger than 0 bytes.') };
    }

    const maxFileSize = this.config().maxFileSizeBytes;

    if (maxFileSize !== undefined && file.size > maxFileSize) {
      return {
        error: this.createError(
          'maxSize',
          file.name,
          `File must be ${this.formatFileSize(maxFileSize)} or smaller.`,
        ),
      };
    }

    const sanitizedName = this.sanitizeFileName(file.name);

    if (!sanitizedName.valid) {
      return { error: sanitizedName.error };
    }

    const allowedExtensions = this.acceptedExtensions();

    if (
      allowedExtensions.length > 0 &&
      (!sanitizedName.extension || !allowedExtensions.includes(sanitizedName.extension))
    ) {
      return {
        error: this.createError(
          'extension',
          file.name,
          `.${sanitizedName.extension || 'unknown'} files are not allowed.`,
        ),
      };
    }

    const duplicateKey = this.fileKey(sanitizedName.safeName, file.size);

    if (existingItems.some((item) => this.fileKey(item.safeName, item.size) === duplicateKey)) {
      return { error: this.createError('duplicate', file.name, 'This file has already been added.') };
    }

    return {
      file,
      originalName: file.name,
      safeName: sanitizedName.safeName,
      extension: sanitizedName.extension,
      size: file.size,
      errors: [],
    };
  }

  private createRejectedFileItem(
    file: File,
    error: FileUploadValidationError,
  ): FileUploadItem {
    const sanitizedName = this.sanitizeFileNameForDisplay(file.name);

    return {
      file,
      originalName: file.name,
      safeName: sanitizedName.safeName,
      extension: sanitizedName.extension,
      size: file.size,
      errors: [error],
    };
  }

  private sanitizeFileName(fileName: string): SanitizedFileName {
    const baseFileName = fileName
      .split(/[/\\]/)
      .at(-1)!
      .replace(UNSAFE_CONTROL_CHARACTERS, '')
      .replace(UNSAFE_FILENAME_CHARACTERS, '-')
      .replace(REPEATED_SPACES, ' ')
      .replace(REPEATED_DOTS, '.')
      .trim();

    const nameParts = baseFileName.split('.').filter((part) => part.length > 0);

    if (nameParts.length === 0) {
      return {
        valid: false,
        error: this.createError('unsafeName', fileName, 'File name is not allowed.'),
      };
    }

    if (nameParts.length > 2) {
      return {
        valid: false,
        error: this.createError('unsafeName', fileName, 'File name cannot contain multiple extensions.'),
      };
    }

    const extension = nameParts.length === 2 ? nameParts[1].toLocaleLowerCase() : '';
    const safeBaseName = nameParts[0].replace(/^[ .-]+|[ .-]+$/g, '');

    if (!safeBaseName) {
      return {
        valid: false,
        error: this.createError('unsafeName', fileName, 'File name is not allowed.'),
      };
    }

    return {
      valid: true,
      safeName: extension ? `${safeBaseName}.${extension}` : safeBaseName,
      extension,
    };
  }

  private sanitizeFileNameForDisplay(fileName: string): {
    readonly safeName: string;
    readonly extension: string;
  } {
    const baseFileName = fileName
      .split(/[/\\]/)
      .at(-1)!
      .replace(UNSAFE_CONTROL_CHARACTERS, '')
      .replace(UNSAFE_FILENAME_CHARACTERS, '-')
      .replace(REPEATED_SPACES, ' ')
      .replace(REPEATED_DOTS, '.')
      .trim();
    const fallbackName = baseFileName || 'file';
    const extension = fallbackName.includes('.')
      ? fallbackName.split('.').at(-1)!.toLocaleLowerCase()
      : '';

    return {
      safeName: fallbackName,
      extension,
    };
  }

  private createError(
    reason: FileUploadValidationReason,
    fileName: string,
    message: string,
  ): FileUploadValidationError {
    return {
      kind: 'fileUpload',
      reason,
      fileName,
      message,
    };
  }

  private readItems(value: FileUploadValue): readonly FileUploadItem[] {
    if (this.isFileUploadItemArray(value)) {
      return value;
    }

    return value ? [value] : [];
  }

  private isFileUploadItemArray(value: FileUploadValue): value is readonly FileUploadItem[] {
    return Array.isArray(value);
  }

  private normalizeExtensions(extensions: readonly string[]): readonly string[] {
    return Array.from(
      new Set(
        extensions
          .map((extension) => extension.trim().replace(/^\./, '').toLocaleLowerCase())
          .filter((extension) => extension.length > 0),
      ),
    );
  }

  private fileKey(safeName: string, size: number): string {
    return `${safeName.toLocaleLowerCase()}:${size}`;
  }

  private hasDraggedFiles(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types ?? []).includes('Files');
  }

  private clearNativeInput(): void {
    const inputElement = this.fileInput()?.nativeElement;

    if (inputElement) {
      inputElement.value = '';
    }
  }
}
