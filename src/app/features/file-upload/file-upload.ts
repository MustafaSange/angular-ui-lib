import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, form, schema, validate } from '@angular/forms/signals';

import {
  FileUploadComponent,
  FileUploadItem,
  FileUploadMultipleConfig,
  FileUploadMultipleValue,
  FileUploadSingleConfig,
  FileUploadSingleValue,
  FileUploadValue,
  SignalFormField,
} from '../../shared/ui-lib';
import { ShowcaseCode } from '../../shared/ui-lib/components/showcase-code';

type FileUploadShowcaseForm = {
  single: FileUploadSingleValue;
  restricted: FileUploadSingleValue;
  multiple: FileUploadMultipleValue;
  buttonOnly: FileUploadSingleValue;
  disabled: FileUploadSingleValue;
  readonly: FileUploadSingleValue;
};

@Component({
  selector: 'app-file-upload',
  imports: [RouterLink, FormField, FileUploadComponent, SignalFormField, ShowcaseCode],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  private readonly model = signal<FileUploadShowcaseForm>({
    single: null,
    restricted: null,
    multiple: [],
    buttonOnly: null,
    disabled: null,
    readonly: this.createDemoItem('signed-contract.pdf', 186_000, 'pdf'),
  });

  protected readonly basicConfig: FileUploadSingleConfig = {};
  protected readonly restrictedConfig: FileUploadSingleConfig = {
    allowedExtensions: ['pdf', 'png'],
    maxFileSizeBytes: 2 * 1024 * 1024,
  };
  protected readonly multipleConfig: FileUploadMultipleConfig = {
    allowedExtensions: ['pdf', 'png', 'jpg'],
    maxFileSizeBytes: 3 * 1024 * 1024,
    maxFiles: 3,
    multiple: true,
  };
  protected readonly buttonOnlyConfig: FileUploadSingleConfig = {
    draggable: false,
  };
  protected readonly disabledConfig: FileUploadSingleConfig = {
    disabled: true,
  };
  protected readonly readonlyConfig: FileUploadSingleConfig = {
    readonly: true,
  };

  protected readonly form = form(
    this.model,
    schema<FileUploadShowcaseForm>((path) => {
      validate(path.single, ({ value }) => this.requiredUploadError(value()));
      validate(path.restricted, ({ value }) => this.requiredUploadError(value()));
      validate(path.multiple, ({ value }) => this.requiredUploadError(value()));
    }),
  );
  protected readonly singleField = this.form.single;
  protected readonly restrictedField = this.form.restricted;
  protected readonly multipleField = this.form.multiple;
  protected readonly buttonOnlyField = this.form.buttonOnly;
  protected readonly disabledField = this.form.disabled;
  protected readonly readonlyField = this.form.readonly;

  protected readonly basicSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema, validate } from '@angular/forms/signals';

import {
  FileUploadComponent,
  FileUploadSingleValue,
  SignalFormField,
} from './shared/ui-lib';

type UploadForm = {
  attachment: FileUploadSingleValue;
};

@Component({
  selector: 'app-basic-upload-example',
  imports: [FormField, FileUploadComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="attachment">Attachment</label>
      <ms-file-upload id="attachment" [formField]="attachmentField" />
    </ms-signal-form-field>
  \`,
})
export class BasicUploadExample {
  private readonly model = signal<UploadForm>({
    attachment: null,
  });

  protected readonly form = form(
    this.model,
    schema<UploadForm>((path) => {
      validate(path.attachment, ({ value }) => {
        const uploadValue = value();
        const files = Array.isArray(uploadValue) ? uploadValue : uploadValue ? [uploadValue] : [];
        const error = files.find((file) => file.errors.length > 0)?.errors[0];

        if (error) {
          return { kind: 'fileUpload', message: error.message };
        }

        return files.length > 0
          ? undefined
          : { kind: 'fileUpload', message: 'Upload a file.' };
      });
    }),
  );
  protected readonly attachmentField = this.form.attachment;
}`;

  protected readonly restrictedSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema, validate } from '@angular/forms/signals';

import {
  FileUploadComponent,
  FileUploadSingleConfig,
  FileUploadSingleValue,
  SignalFormField,
} from './shared/ui-lib';

type UploadForm = {
  attachment: FileUploadSingleValue;
};

@Component({
  selector: 'app-restricted-upload-example',
  imports: [FormField, FileUploadComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="restricted-attachment">Attachment</label>
      <ms-file-upload
        id="restricted-attachment"
        [formField]="attachmentField"
        [config]="uploadConfig"
      />
    </ms-signal-form-field>
  \`,
})
export class RestrictedUploadExample {
  private readonly model = signal<UploadForm>({
    attachment: null,
  });

  protected readonly uploadConfig: FileUploadSingleConfig = {
    allowedExtensions: ['pdf', 'png'],
    maxFileSizeBytes: 2 * 1024 * 1024,
  };

  protected readonly form = form(
    this.model,
    schema<UploadForm>((path) => {
      validate(path.attachment, ({ value }) => {
        const uploadValue = value();
        const files = Array.isArray(uploadValue) ? uploadValue : uploadValue ? [uploadValue] : [];
        const error = files.find((file) => file.errors.length > 0)?.errors[0];

        if (error) {
          return { kind: 'fileUpload', message: error.message };
        }

        return files.length > 0
          ? undefined
          : { kind: 'fileUpload', message: 'Upload a PDF or PNG.' };
      });
    }),
  );
  protected readonly attachmentField = this.form.attachment;
}`;

  protected readonly multipleSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema, validate } from '@angular/forms/signals';

import {
  FileUploadComponent,
  FileUploadMultipleConfig,
  FileUploadMultipleValue,
  SignalFormField,
} from './shared/ui-lib';

type UploadForm = {
  attachments: FileUploadMultipleValue;
};

@Component({
  selector: 'app-multiple-upload-example',
  imports: [FormField, FileUploadComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="attachments">Attachments</label>
      <ms-file-upload id="attachments" [formField]="attachmentsField" [config]="uploadConfig" />
    </ms-signal-form-field>
  \`,
})
export class MultipleUploadExample {
  private readonly model = signal<UploadForm>({
    attachments: [],
  });

  protected readonly uploadConfig: FileUploadMultipleConfig = {
    allowedExtensions: ['pdf', 'png', 'jpg'],
    maxFileSizeBytes: 3 * 1024 * 1024,
    maxFiles: 3,
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
          : { kind: 'fileUpload', message: 'Upload a file.' };
      });
    }),
  );
  protected readonly attachmentsField = this.form.attachments;
}`;

  protected readonly statesSnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import {
  FileUploadComponent,
  FileUploadSingleConfig,
  FileUploadSingleValue,
  SignalFormField,
} from './shared/ui-lib';

type UploadForm = {
  disabled: FileUploadSingleValue;
  readonly: FileUploadSingleValue;
};

@Component({
  selector: 'app-upload-states-example',
  imports: [FormField, FileUploadComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="disabled-upload">Disabled upload</label>
      <ms-file-upload id="disabled-upload" [formField]="disabledField" [config]="disabledConfig" />
    </ms-signal-form-field>

    <ms-signal-form-field>
      <label for="readonly-upload">Readonly upload</label>
      <ms-file-upload id="readonly-upload" [formField]="readonlyField" [config]="readonlyConfig" />
    </ms-signal-form-field>
  \`,
})
export class UploadStatesExample {
  private readonly model = signal<UploadForm>({
    disabled: null,
    readonly: null,
  });

  protected readonly disabledConfig: FileUploadSingleConfig = { disabled: true };
  protected readonly readonlyConfig: FileUploadSingleConfig = { readonly: true };
  protected readonly form = form(this.model, schema<UploadForm>(() => {}));
  protected readonly disabledField = this.form.disabled;
  protected readonly readonlyField = this.form.readonly;
}`;

  protected readonly buttonOnlySnippet = `import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';

import {
  FileUploadComponent,
  FileUploadSingleConfig,
  FileUploadSingleValue,
  SignalFormField,
} from './shared/ui-lib';

type UploadForm = {
  attachment: FileUploadSingleValue;
};

@Component({
  selector: 'app-button-only-upload-example',
  imports: [FormField, FileUploadComponent, SignalFormField],
  template: \`
    <ms-signal-form-field>
      <label for="button-only-upload">Attachment</label>
      <ms-file-upload
        id="button-only-upload"
        [formField]="attachmentField"
        [config]="uploadConfig"
      />
    </ms-signal-form-field>
  \`,
})
export class ButtonOnlyUploadExample {
  private readonly model = signal<UploadForm>({
    attachment: null,
  });

  protected readonly uploadConfig: FileUploadSingleConfig = {
    draggable: false,
  };
  protected readonly form = form(this.model, schema<UploadForm>(() => {}));
  protected readonly attachmentField = this.form.attachment;
}`;

  private requiredUploadError(
    value: FileUploadValue,
  ): { readonly kind: 'fileUpload'; readonly message: string } | undefined {
    const files = Array.isArray(value) ? value : value ? [value] : [];
    const error = files.find((file) => file.errors.length > 0)?.errors[0];

    if (error) {
      return { kind: 'fileUpload', message: error.message };
    }

    return files.length > 0
      ? undefined
      : { kind: 'fileUpload', message: 'Upload a file.' };
  }

  private createDemoItem(fileName: string, size: number, extension: string): FileUploadItem {
    const file = new File(['readonly demo'], fileName, { type: 'application/octet-stream' });

    return {
      file,
      originalName: fileName,
      safeName: fileName,
      extension,
      size,
      errors: [],
    };
  }
}
