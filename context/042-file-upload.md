# Feature 042: File Upload

## Goal

Create a reusable Angular 22 signal-forms file upload control for button-triggered file selection
and drag-and-drop uploads.

The component is designed primarily for `[formField]`, where the upload value is linked to the
parent signal-form model. File upload validation uses normal signal-form validation errors with
`kind: 'fileUpload'` and a specific `message`; `ms-signal-form-field` displays that message through
its default error rendering.

## Public API

Import public pieces from the folder barrel:

```ts
import {
  FileUploadComponent,
  FileUploadConfig,
  FileUploadItem,
  FileUploadValidationError,
  FileUploadValue,
} from '../../shared/ui-lib';
```

Public pieces:

- `FileUploadComponent` with selector `ms-file-upload`
- `FileUploadConfig` for accepted extensions, max size, multiple, disabled, and readonly options
- `FileUploadItem` for accepted files and sanitized file metadata
- `FileUploadValidationError` for rejected-file detail messages
- `FileUploadValue` for the signal-form value

`FileUploadComponent` implements `FormValueControl<FileUploadValue>` and exposes the required
internal `value` model used by Angular signal forms.

`FileUploadConfig`:

- `allowedExtensions?: readonly string[]`
- `maxFileSizeBytes?: number`
- `multiple?: boolean`
- `draggable?: boolean`
- `disabled?: boolean`
- `readonly?: boolean`

Defaults:

- `multiple` is `false`
- `draggable` is `true`
- minimum file size is always greater than `0`
- max file size is unrestricted unless configured
- allowed extensions are unrestricted unless configured

## Desired Usage

Use the control with Angular signal forms and `[formField]`.

```html
<ms-signal-form-field>
  <label for="attachments">Attachments</label>
  <ms-file-upload id="attachments" [formField]="attachmentsField" [config]="uploadConfig" />
</ms-signal-form-field>
```

```ts
import { Component, signal } from '@angular/core';
import { FormField, form, schema, validate } from '@angular/forms/signals';

import {
  FileUploadComponent,
  FileUploadConfig,
  FileUploadValue,
  SignalFormField,
} from './shared/ui-lib';

type UploadForm = {
  attachments: FileUploadValue;
};

@Component({
  selector: 'app-upload-example',
  imports: [FormField, FileUploadComponent, SignalFormField],
  template: `
    <ms-signal-form-field>
      <label for="attachments">Attachments</label>
      <ms-file-upload id="attachments" [formField]="attachmentsField" [config]="uploadConfig" />
    </ms-signal-form-field>
  `,
})
export class UploadExample {
  private readonly model = signal<UploadForm>({
    attachments: [],
  });

  protected readonly uploadConfig: FileUploadConfig = {
    allowedExtensions: ['pdf', 'png'],
    maxFileSizeBytes: 2 * 1024 * 1024,
    multiple: true,
  };

  protected readonly form = form(
    this.model,
    schema<UploadForm>((path) => {
      validate(path.attachments, ({ value }) => {
        const uploadValue = value();
        const files = Array.isArray(uploadValue) ? uploadValue : uploadValue ? [uploadValue] : [];
        const error = files.find((file) => file.errors.length > 0)?.errors[0];

        if (error) {
          return { kind: 'fileUpload', message: error.message };
        }

        return files.length > 0
          ? undefined
          : { kind: 'fileUpload', message: 'Upload at least one valid file.' };
      });
    }),
  );
  protected readonly attachmentsField = this.form.attachments;
}
```

## Component Structure

The implementation lives in:

`src/app/shared/ui-lib/components/file-upload`

The feature includes:

- `FileUploadComponent`
- `file-upload-types.ts`
- `index.ts`

## Behavior

- Button click triggers a hidden native `<input type="file">`.
- Drag and drop uses the same processing path as input selection when `draggable` is enabled.
- `draggable: false` disables drag/drop handling and uses button-only helper copy.
- Single mode stores `FileUploadItem | null`.
- Multiple mode stores `readonly FileUploadItem[]`.
- Invalid selected or dropped files are stored as errored `FileUploadItem` values so signal-form
  validation can display their messages in the form-field message row.
- Accepted file items preserve the original immutable `File` and expose `originalName`, `safeName`,
  `extension`, `size`, and `errors`.
- Sanitization does not mutate `File.name`; it produces `safeName` for display and upload metadata.
- Validation rejects empty files, oversized files, disallowed extensions, unsafe names, deceptive
  double extensions, multiple files in single mode, and duplicates.
- The component emits `touch` after selection, drop, removal, or native input blur.

## Validation And Error Display

- Signal-form schema validation should return upload field errors with `kind: 'fileUpload'` and a
  specific user-facing `message`.
- `ms-signal-form-field` displays the `fileUpload` error `message` through its default error
  rendering when no custom `<ms-error>` is projected.
- Rejected-file details are exposed through `FileUploadItem.errors`; the surrounding form-field
  message row is controlled by signal-form errors.

## Styling

Feature styles live in:

`src/styles/components/_file-upload.scss`

The styles are forwarded from:

`src/styles/components/_index.scss`

The upload control uses logical CSS properties, existing design tokens, and concise internal hooks
such as `.drop-zone`, `.file-list`, `.file-item`, and `.file-rejections`.

## Accessibility

- The native file input remains in the DOM and is visually hidden.
- The visible button has readable text and keyboard activation.
- The drop zone exposes help text through `aria-describedby`.
- Selected files render as a semantic list.
- Accepted files are displayed with extra-small removable `ms-chip` tokens.
- Remove buttons include per-file accessible labels.
- Rejected files are announced through a polite status region.
- Disabled and readonly states prevent file selection, drop, and removal.

## Showcase

Add a showcase page under `src/app/features/file-upload`.

Showcase snippets use `ShowcaseCode`, are hand-authored, and demonstrate `[formField]` with
schema validators that return `kind: 'fileUpload'` and specific messages.

Showcase variants:

- basic single upload
- allowed extensions and max size
- multiple upload
- button-only upload with `draggable: false`
- disabled
- readonly
- drag and drop

## Angular Rules

- Use standalone Angular APIs.
- Do not add `standalone: true`.
- Rely on Angular 22 default OnPush change detection.
- Use signals and signal forms APIs.
- Keep strict TypeScript.
- Do not add or update tests for this behavior.

## Acceptance Criteria

- `ms-file-upload` is exported from the feature folder barrel and shared UI barrel.
- `[formField]` syncs the upload value with the parent signal-form model.
- Button-triggered selection and drag/drop use the same validation behavior.
- Rejected files are represented as errored items so validators can surface their messages.
- File-upload schema errors display their specific `message`.
- Styling is forwarded and works inside `ms-signal-form-field`.
- The showcase demonstrates the core variants with matching copyable snippets.
