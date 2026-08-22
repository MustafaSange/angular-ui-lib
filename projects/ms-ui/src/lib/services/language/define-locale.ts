import type { DefinedLocalePatch, Locale, LocalePatch, LocaleValue } from './language-types';
import type { en } from './locales/en';

type Whitespace = ' ' | '\n' | '\r' | '\t';

type TrimStart<Value extends string> = Value extends `${Whitespace}${infer Rest}`
  ? TrimStart<Rest>
  : Value;

type TrimEnd<Value extends string> = Value extends `${infer Rest}${Whitespace}`
  ? TrimEnd<Rest>
  : Value;

type Trim<Value extends string> = TrimStart<TrimEnd<Value>>;

type InterpolationParamName<Value> = Value extends string
  ? Value extends `${string}{{${infer Param}}}${infer Rest}`
    ? Trim<Param> | InterpolationParamName<Rest>
    : never
  : never;

type HasMatchingParams<Source, Translation> = Translation extends string
  ? Exclude<InterpolationParamName<Source>, InterpolationParamName<Translation>> extends never
    ? Exclude<InterpolationParamName<Translation>, InterpolationParamName<Source>> extends never
      ? Translation
      : never
    : never
  : InterpolationParamName<Source> extends never
    ? Translation
    : never;

type ValidateLocaleNode<Source, Translation> = Source extends LocaleValue
  ? HasMatchingParams<Source, Translation>
  : Translation extends Readonly<Record<string, unknown>>
    ? {
        readonly [Key in keyof Translation]: Key extends keyof Source
          ? ValidateLocaleNode<Source[Key], Translation[Key]>
          : never;
      }
    : never;

/** Defines a complete locale and verifies that its interpolation params match English. */
export function defineLocale<const Translation extends Locale>(
  locale: Translation & ValidateLocaleNode<typeof en, Translation>,
): Translation {
  return locale;
}

/** Defines a locale patch and verifies that its interpolation params match English. */
export function defineLocalePatch<const Translation extends LocalePatch<Locale>>(
  locale: Translation & ValidateLocaleNode<typeof en, Translation>,
): Translation & DefinedLocalePatch {
  return locale as unknown as Translation & DefinedLocalePatch;
}
