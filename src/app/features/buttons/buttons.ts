import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDisabledIconsShowcase } from './showcases/button-disabled-icons/button-disabled-icons';
import { ButtonFullWidthShowcase } from './showcases/button-full-width/button-full-width';
import { ButtonIconOnlyShowcase } from './showcases/button-icon-only/button-icon-only';
import { ButtonIconSizesShowcase } from './showcases/button-icon-sizes/button-icon-sizes';
import { ButtonLinksShowcase } from './showcases/button-links/button-links';
import { ButtonOutlineVariantsShowcase } from './showcases/button-outline-variants/button-outline-variants';
import { ButtonSizesShowcase } from './showcases/button-sizes/button-sizes';
import { ButtonStatesShowcase } from './showcases/button-states/button-states';
import { ButtonVariantsShowcase } from './showcases/button-variants/button-variants';

@Component({
  selector: 'app-buttons',
  imports: [
    RouterLink,
    ButtonVariantsShowcase,
    ButtonLinksShowcase,
    ButtonOutlineVariantsShowcase,
    ButtonSizesShowcase,
    ButtonStatesShowcase,
    ButtonFullWidthShowcase,
    ButtonIconOnlyShowcase,
    ButtonIconSizesShowcase,
    ButtonDisabledIconsShowcase,
  ],
  templateUrl: './buttons.html',
  styleUrl: './buttons.scss',
})
export class Buttons {}
