import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasicModalShowcase } from './showcases/basic-modal/basic-modal';
import { DeclarativeModalShowcase } from './showcases/declarative-modal/declarative-modal';
import { HeaderFooterModalShowcase } from './showcases/header-footer-modal/header-footer-modal';
import { LockedModalShowcase } from './showcases/locked-modal/locked-modal';
import { ScrollableModalShowcase } from './showcases/scrollable-modal/scrollable-modal';
import { StackedModalShowcase } from './showcases/stacked-modal/stacked-modal';

@Component({
  selector: 'app-modal',
  imports: [
    RouterLink,
    DeclarativeModalShowcase,
    BasicModalShowcase,
    HeaderFooterModalShowcase,
    LockedModalShowcase,
    StackedModalShowcase,
    ScrollableModalShowcase,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {}
