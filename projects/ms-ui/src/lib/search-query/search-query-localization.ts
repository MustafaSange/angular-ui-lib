import type { LanguageService } from '../services/language';
import type { SearchPropertyConfig } from './search-query-types';
import {
  DEFAULT_SEARCH_STRING_MAX_LENGTH,
  getSearchScalarError,
  type SearchScalarErrorKind,
} from './search-query-value';

export function getLocalizedSearchScalarError(
  languageService: LanguageService,
  property: SearchPropertyConfig,
  value: string,
): string {
  return getSearchScalarError(property, value, (kind, params) =>
    translateScalarError(languageService, kind, params.maxLength),
  );
}

function translateScalarError(
  languageService: LanguageService,
  kind: SearchScalarErrorKind,
  maxLength?: number,
): string {
  switch (kind) {
    case 'guid':
      return languageService.translate('validation.validGuid');
    case 'wholeNumber':
      return languageService.translate('validation.wholeNumber');
    case 'safeWholeNumber':
      return languageService.translate('validation.safeWholeNumber');
    case 'number':
      return languageService.translate('validation.validNumber');
    case 'date':
      return languageService.translate('validation.validDate');
    case 'time':
      return languageService.translate('validation.validTime');
    case 'dateTime':
      return languageService.translate('validation.validDateTime');
    case 'maxLength':
      return languageService.translate('validation.maxCharacters', {
        maxLength: maxLength ?? DEFAULT_SEARCH_STRING_MAX_LENGTH,
      });
  }
}
