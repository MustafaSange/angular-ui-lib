import { InjectionToken } from '@angular/core';

import type { ModalConfig } from './modal-config';
import { ModalRef } from './modal-ref';

export const MODAL_CONFIG = new InjectionToken<ModalConfig>('MODAL_CONFIG');

export const MODAL_DATA = new InjectionToken<unknown>('MODAL_DATA');

export const MODAL_REF = new InjectionToken<ModalRef<unknown>>('MODAL_REF');
