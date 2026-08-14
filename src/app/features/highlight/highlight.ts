import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/showcase-code';
import { HighlightPipe } from '../../shared/ui-lib';

interface HighlightExampleValue {
  readonly label: string;
  readonly search: string | null;
  readonly value: string | null;
}

@Component({
  selector: 'app-highlight',
  imports: [RouterLink, ShowcaseCode, HighlightPipe],
  templateUrl: './highlight.html',
  styleUrl: './highlight.scss',
})
export class Highlight {
  protected readonly description =
    'Angular makes enterprise applications approachable. ANGULAR also keeps templates secure.';
  protected readonly searchText = signal('angular');
  protected readonly literalText = 'Price is $5.00 + tax. Call (555) [today].';
  protected readonly literalSearch = '$5.00 + tax';
  protected readonly htmlLikeText = "<script>alert('example')</script> remains inert text.";
  protected readonly htmlLikeSearch = '<script>';
  protected readonly edgeCases: readonly HighlightExampleValue[] = [
    { label: 'Beginning', value: 'Angular starts here', search: 'angular' },
    { label: 'Middle', value: 'Learn Angular today', search: 'angular' },
    { label: 'End', value: 'Built with Angular', search: 'angular' },
    { label: 'Repeated Casing', value: 'Angular angular ANGULAR', search: 'angular' },
    { label: 'Adjacent Matches', value: 'aaaa', search: 'aa' },
    { label: 'No Match', value: 'Standalone components', search: 'service' },
    { label: 'Whitespace Search', value: 'Original text remains', search: '   ' },
    { label: 'Missing Search', value: 'Original text remains', search: null },
    { label: 'Missing Value', value: null, search: 'angular' },
  ];

  protected readonly interactiveSnippet = `import { Component, signal } from '@angular/core';

import { HighlightPipe } from './shared/ui-lib';

@Component({
  selector: 'app-interactive-highlight-example',
  imports: [HighlightPipe],
  template: \`
    <label for="highlight-search">Search Text</label>
    <input
      #searchInput
      id="highlight-search"
      type="search"
      [value]="searchText()"
      (input)="searchText.set(searchInput.value)"
    />

    <p>
      @for (part of description | highlight: searchText(); track $index) {
        @if (part.match) {
          <mark>{{ part.text }}</mark>
        } @else {
          <span>{{ part.text }}</span>
        }
      }
    </p>
  \`,
})
export class InteractiveHighlightExample {
  readonly description =
    'Angular makes enterprise applications approachable. ANGULAR also keeps templates secure.';
  readonly searchText = signal('angular');
}`;

  protected readonly literalSnippet = `import { Component } from '@angular/core';

import { HighlightPipe } from './shared/ui-lib';

@Component({
  selector: 'app-literal-highlight-example',
  imports: [HighlightPipe],
  template: \`
    <p>
      @for (part of value | highlight: search; track $index) {
        @if (part.match) {
          <mark>{{ part.text }}</mark>
        } @else {
          <span>{{ part.text }}</span>
        }
      }
    </p>
  \`,
})
export class LiteralHighlightExample {
  readonly value = 'Price is $5.00 + tax. Call (555) [today].';
  readonly search = '$5.00 + tax';
}`;

  protected readonly edgeCasesSnippet = `import { Component } from '@angular/core';

import { HighlightPipe } from './shared/ui-lib';

interface ExampleValue {
  readonly label: string;
  readonly search: string | null;
  readonly value: string | null;
}

@Component({
  selector: 'app-highlight-values-example',
  imports: [HighlightPipe],
  template: \`
    @for (example of examples; track example.label) {
      <p>
        <strong>{{ example.label }}:</strong>
        @for (part of example.value | highlight: example.search; track $index) {
          @if (part.match) {
            <mark>{{ part.text }}</mark>
          } @else {
            <span>{{ part.text }}</span>
          }
        } @empty {
          No parts returned
        }
      </p>
    }
  \`,
})
export class HighlightValuesExample {
  readonly examples: readonly ExampleValue[] = [
    { label: 'Beginning', value: 'Angular starts here', search: 'angular' },
    { label: 'Middle', value: 'Learn Angular today', search: 'angular' },
    { label: 'End', value: 'Built with Angular', search: 'angular' },
    { label: 'Repeated Casing', value: 'Angular angular ANGULAR', search: 'angular' },
    { label: 'Adjacent Matches', value: 'aaaa', search: 'aa' },
    { label: 'No Match', value: 'Standalone components', search: 'service' },
    { label: 'Whitespace Search', value: 'Original text remains', search: '   ' },
    { label: 'Missing Search', value: 'Original text remains', search: null },
    { label: 'Missing Value', value: null, search: 'angular' },
  ];
}`;

  protected readonly safeRenderingSnippet = `import { Component } from '@angular/core';

import { HighlightPipe } from './shared/ui-lib';

@Component({
  selector: 'app-safe-highlight-example',
  imports: [HighlightPipe],
  template: \`
    <p>
      @for (part of value | highlight: search; track $index) {
        @if (part.match) {
          <mark>{{ part.text }}</mark>
        } @else {
          <span>{{ part.text }}</span>
        }
      }
    </p>
  \`,
})
export class SafeHighlightExample {
  readonly value = "<script>alert('example')</script> remains inert text.";
  readonly search = '<script>';
}`;
}
