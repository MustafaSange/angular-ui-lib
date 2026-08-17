import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasicModalShowcase } from './showcases/basic-modal/basic-modal';
import { DeclarativeModalShowcase } from './showcases/declarative-modal/declarative-modal';
import { GuardedModalShowcase } from './showcases/guarded-modal/guarded-modal';
import { HeaderFooterModalShowcase } from './showcases/header-footer-modal/header-footer-modal';
import { LockedModalShowcase } from './showcases/locked-modal/locked-modal';
import { NoPaddingModalShowcase } from './showcases/no-padding-modal/no-padding-modal';
import { ScrollableModalShowcase } from './showcases/scrollable-modal/scrollable-modal';
import { SizePresetsModalShowcase } from './showcases/size-presets-modal/size-presets-modal';
import { StackedModalShowcase } from './showcases/stacked-modal/stacked-modal';

@Component({
  selector: 'app-modal',
  imports: [
    RouterLink,
    DeclarativeModalShowcase,
    BasicModalShowcase,
    SizePresetsModalShowcase,
    GuardedModalShowcase,
    HeaderFooterModalShowcase,
    NoPaddingModalShowcase,
    LockedModalShowcase,
    StackedModalShowcase,
    ScrollableModalShowcase,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {}
