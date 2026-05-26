import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import { MATERIAL_ICONS } from './icon-registry';

const MATERIAL_SYMBOLS_LINK_ID = 'ms-material-symbols-font';
const MATERIAL_SYMBOLS_FAMILY = 'Material Symbols Outlined:opsz,wght,FILL,GRAD@20,500,0..1,0';

@Injectable({
  providedIn: 'root',
})
export class MaterialIconsService {
  private readonly document = inject(DOCUMENT);

  loadIcons(): void {
    if (this.document.getElementById(MATERIAL_SYMBOLS_LINK_ID)) {
      return;
    }

    const href = new URL('https://fonts.googleapis.com/css2');
    const iconNames = [...new Set(MATERIAL_ICONS)].sort().join(',');

    href.searchParams.set('family', MATERIAL_SYMBOLS_FAMILY);
    href.searchParams.set('icon_names', iconNames);
    href.searchParams.set('display', 'block');

    const link = this.document.createElement('link');
    link.id = MATERIAL_SYMBOLS_LINK_ID;
    link.rel = 'stylesheet';
    link.href = href.toString();

    this.document.head.appendChild(link);
  }
}
