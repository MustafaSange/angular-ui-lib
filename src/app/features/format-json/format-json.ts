import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';
import { FormatJsonPipe } from '../../shared/ui-lib';

@Component({
  selector: 'app-format-json',
  imports: [RouterLink, ShowcaseCode, FormatJsonPipe],
  templateUrl: './format-json.html',
  styleUrl: './format-json.scss',
})
export class FormatJson {
  protected readonly jsonString =
    '{"name":"Ada Lovelace","roles":["admin","reviewer"],"active":true}';
  protected readonly structuredValue = {
    project: 'UI library',
    version: 22,
    features: ['signals', 'standalone APIs'],
  };
  protected readonly invalidJson = 'This is not JSON';

  protected readonly jsonStringSnippet = `import { Component } from '@angular/core';

import { FormatJsonPipe } from './shared/ui-lib';

@Component({
  selector: 'app-json-string-example',
  imports: [FormatJsonPipe],
  template: \`<pre><code>{{ payload | formatJson }}</code></pre>\`,
})
export class JsonStringExample {
  readonly payload =
    '{"name":"Ada Lovelace","roles":["admin","reviewer"],"active":true}';
}`;

  protected readonly structuredValueSnippet = `import { Component } from '@angular/core';

import { FormatJsonPipe } from './shared/ui-lib';

@Component({
  selector: 'app-structured-json-example',
  imports: [FormatJsonPipe],
  template: \`<pre><code>{{ settings | formatJson }}</code></pre>\`,
})
export class StructuredJsonExample {
  readonly settings = {
    project: 'UI library',
    version: 22,
    features: ['signals', 'standalone APIs'],
  };
}`;

  protected readonly invalidJsonSnippet = `import { Component } from '@angular/core';

import { FormatJsonPipe } from './shared/ui-lib';

@Component({
  selector: 'app-invalid-json-example',
  imports: [FormatJsonPipe],
  template: \`<p>Output: <code>{{ value | formatJson }}</code></p>\`,
})
export class InvalidJsonExample {
  readonly value = 'This is not JSON';
}`;
}
