import { inject, Pipe, PipeTransform } from '@angular/core';

import {
  LanguageService,
  type TranslationKey,
  type TranslationParams,
} from '../../services/language';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform<Key extends TranslationKey>(key: Key, params?: TranslationParams<Key>): string {
    return this.languageService.translate(key, params);
  }
}
