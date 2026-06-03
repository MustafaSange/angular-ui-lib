import { InjectionToken } from '@angular/core';

import type { BottomSheetConfig } from './bottom-sheet-config';
import { BottomSheetRef } from './bottom-sheet-ref';

export const BOTTOM_SHEET_CONFIG = new InjectionToken<BottomSheetConfig>('BOTTOM_SHEET_CONFIG');

export const BOTTOM_SHEET_DATA = new InjectionToken<unknown>('BOTTOM_SHEET_DATA');

export const BOTTOM_SHEET_REF = new InjectionToken<BottomSheetRef<unknown>>('BOTTOM_SHEET_REF');
