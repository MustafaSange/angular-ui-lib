import { HttpContextToken } from '@angular/common/http';

export const NETWORK_ERROR_STATUS = 0;
export const SKIP_API_ERROR_TOAST = new HttpContextToken<readonly number[]>(() => []);
