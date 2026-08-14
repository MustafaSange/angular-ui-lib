import type { FileUploadExtension } from './file-upload-meta';

export type FileUploadValidationReason =
  | 'empty'
  | 'maxSize'
  | 'extension'
  | 'mimeType'
  | 'unsafeName'
  | 'multiple'
  | 'maxFiles'
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

export type FileUploadSingleValue = FileUploadItem | null;

export type FileUploadMultipleValue = readonly FileUploadItem[];

export type FileUploadValue = FileUploadSingleValue | FileUploadMultipleValue;

export interface FileUploadBaseConfig {
  readonly allowedExtensions?: readonly FileUploadExtension[];
  readonly maxFileSizeBytes?: number;
  readonly draggable?: boolean;
  readonly disabled?: boolean;
  readonly readonly?: boolean;
}

export interface FileUploadSingleConfig extends FileUploadBaseConfig {
  readonly multiple?: false;
}

export interface FileUploadMultipleConfig extends FileUploadBaseConfig {
  readonly multiple: true;
  readonly maxFiles?: number;
}

export type FileUploadConfig = FileUploadSingleConfig | FileUploadMultipleConfig;
