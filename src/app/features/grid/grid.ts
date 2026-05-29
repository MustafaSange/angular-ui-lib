import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ShowcaseCode } from '../../shared/components/showcase-code';

@Component({
  selector: 'app-grid',
  imports: [RouterLink, ShowcaseCode],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid {
  protected readonly columns = Array.from({ length: 12 }, (_, index) => index + 1);

  protected readonly snippets = {
    columns: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-twelve-column-grid-example',
  template: \`
    <div class="row row-gap-8">
      @for (column of columns; track column) {
        <div class="col-1">{{ column }}</div>
      }
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwelveColumnGridExample {
  protected readonly columns = Array.from({ length: 12 }, (_, index) => index + 1);
}`,
    spans: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-grid-spans-example',
  template: \`
    <div class="row row-gap-12">
      <div class="col-12">col-12</div>
      <div class="col-6">col-6</div>
      <div class="col-6">col-6</div>
      <div class="col-4">col-4</div>
      <div class="col-4">col-4</div>
      <div class="col-4">col-4</div>
      <div class="col-3">col-3</div>
      <div class="col-3">col-3</div>
      <div class="col-3">col-3</div>
      <div class="col-3">col-3</div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridSpansExample {}`,
    responsive: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-responsive-grid-example',
  template: \`
    <div class="row row-gap-12">
      <div class="col-12 sm-col-6 md-col-4 lg-col-4 xl-col-4">Responsive A</div>
      <div class="col-12 sm-col-6 md-col-4 lg-col-4 xl-col-4">Responsive B</div>
      <div class="col-12 sm-col-6 md-col-4 lg-col-4 xl-col-4">Responsive C</div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveGridExample {}`,
    containers: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-containers-example',
  template: \`
    <div class="container-narrow">container-narrow</div>
    <div class="container-content">container-content</div>
    <div class="container-page">container-page</div>
    <div class="container-wide">container-wide</div>
    <div class="container-full">container-full</div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainersExample {}`,
  };
}
