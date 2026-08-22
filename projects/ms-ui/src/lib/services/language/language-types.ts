import type { en } from './locales/en';

export type LanguageCode = 'en' | 'ar';
export type LocaleValue = string | number | boolean;

export type LocaleShape<T> = {
  readonly [Key in keyof T]: T[Key] extends LocaleValue
    ? LocaleValue
    : T[Key] extends Readonly<Record<string, unknown>>
      ? LocaleShape<T[Key]>
      : never;
};

export type Locale = LocaleShape<typeof en>;

export type LocalePatch<T> = {
  readonly [Key in keyof T]?: T[Key] extends LocaleValue
    ? LocaleValue
    : T[Key] extends Readonly<Record<string, unknown>>
      ? LocalePatch<T[Key]>
      : never;
};

declare const DEFINED_LOCALE_PATCH: unique symbol;

/** A custom locale patch validated against the built-in English locale. */
export type DefinedLocalePatch = LocalePatch<Locale> & {
  readonly [DEFINED_LOCALE_PATCH]: true;
};

export type LocalePatchLoader = () => Promise<DefinedLocalePatch>;
export type LocalePatchSource = DefinedLocalePatch | LocalePatchLoader;

export type LanguageLocales = Readonly<Partial<Record<LanguageCode, LocalePatchSource>>>;

type NestedTranslationKey<T> = {
  [Key in keyof T & string]: T[Key] extends LocaleValue
    ? Key
    : T[Key] extends Readonly<Record<string, unknown>>
      ? `${Key}.${NestedTranslationKey<T[Key]>}`
      : never;
}[keyof T & string];

type Whitespace = ' ' | '\n' | '\r' | '\t';

type TrimStart<Value extends string> = Value extends `${Whitespace}${infer Rest}`
  ? TrimStart<Rest>
  : Value;

type TrimEnd<Value extends string> = Value extends `${infer Rest}${Whitespace}`
  ? TrimEnd<Rest>
  : Value;

type Trim<Value extends string> = TrimStart<TrimEnd<Value>>;

type TranslationValue<T, Key extends string> = Key extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? TranslationValue<T[Head], Tail>
    : never
  : Key extends keyof T
    ? T[Key]
    : never;

type InterpolationParamName<Value> = Value extends string
  ? Value extends `${string}{{${infer Param}}}${infer Rest}`
    ? Trim<Param> | InterpolationParamName<Rest>
    : never
  : never;

export type TranslationKey = NestedTranslationKey<typeof en>;

export type TranslationParamName<Key extends TranslationKey> = InterpolationParamName<
  TranslationValue<typeof en, Key>
>;

export type TranslationParams<Key extends TranslationKey = TranslationKey> = [
  TranslationParamName<Key>,
] extends [never]
  ? Readonly<Record<string, never>>
  : Readonly<Partial<Record<TranslationParamName<Key>, LocaleValue>>>;
