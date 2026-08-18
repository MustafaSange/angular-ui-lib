import { HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING_INDICATOR = new HttpContextToken<boolean>(() => false);
