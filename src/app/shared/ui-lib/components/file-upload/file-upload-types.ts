export type FileUploadValidationReason =
  | 'empty'
  | 'maxSize'
  | 'extension'
  | 'unsafeName'
  | 'multiple'
  | 'duplicate';

export interface FileUploadValidationError {
  readonly kind: 'fileUpload';
  readonly reason: FileUploadValidationReason;
  readonly fileName: string;
  readonly message: string;
}

export interface FileUploadItem {
  readonly file: File;
  readonly originalName: string;
  readonly safeName: string;
  readonly extension: string;
  readonly size: number;
  readonly errors: readonly FileUploadValidationError[];
}

export type FileUploadValue = FileUploadItem | readonly FileUploadItem[] | null;

export interface FileUploadConfig {
  readonly allowedExtensions?: readonly string[];
  readonly maxFileSizeBytes?: number;
  readonly multiple?: boolean;
  readonly draggable?: boolean;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
}
