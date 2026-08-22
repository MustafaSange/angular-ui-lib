import { defineLocale } from '../define-locale';

export const ar = defineLocale({
  language: {
    english: 'English',
    arabic: 'العربية',
  },
  greeting: {
    welcome: 'مرحباً، {{name}}!',
  },
  validation: {
    required: 'مطلوب',
    min: 'الحد الأدنى {{min}}',
    max: 'الحد الأقصى {{max}}',
    minLength: 'الحد الأدنى {{minLength}} أحرف',
    maxLength: 'الحد الأقصى {{maxLength}} أحرف',
    email: 'بريد إلكتروني غير صالح',
    pattern: 'تنسيق غير صالح',
    parse: 'قيمة غير صالحة',
  },
});
