import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { provideUiLib } from '../config';
import { DensityService } from './density.service';

describe('DensityService', () => {
  afterEach(() => {
    const document = TestBed.inject(DOCUMENT);
    delete document.documentElement.dataset['density'];
    TestBed.resetTestingModule();
  });

  it('uses default density when no configuration is provided', () => {
    TestBed.configureTestingModule({});

    const service = TestBed.inject(DensityService);
    const document = TestBed.inject(DOCUMENT);

    expect(service.density()).toBe('default');
    expect(document.documentElement.dataset['density']).toBe('default');
  });

  it('uses the configured application density', () => {
    TestBed.configureTestingModule({
      providers: [provideUiLib({ density: 'compact' })],
    });

    const service = TestBed.inject(DensityService);
    const document = TestBed.inject(DOCUMENT);

    expect(service.density()).toBe('compact');
    expect(document.documentElement.dataset['density']).toBe('compact');
  });

  it('updates density at runtime', () => {
    TestBed.configureTestingModule({
      providers: [provideUiLib()],
    });

    const service = TestBed.inject(DensityService);
    const document = TestBed.inject(DOCUMENT);

    service.setDensity('compact');

    expect(service.density()).toBe('compact');
    expect(document.documentElement.dataset['density']).toBe('compact');
  });
});
