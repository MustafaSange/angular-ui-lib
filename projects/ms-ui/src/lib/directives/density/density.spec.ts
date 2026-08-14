import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DensityDirective } from './density';

@Component({
  imports: [DensityDirective],
  template: `
    <section msDensity="compact">
      <button msDensity="default" type="button">Default exception</button>
    </section>
  `,
})
class DensityHost {}

describe('DensityDirective', () => {
  it('sets density attributes for nested scopes', async () => {
    await TestBed.configureTestingModule({
      imports: [DensityHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(DensityHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('section')?.dataset['density']).toBe('compact');
    expect(host.querySelector('button')?.dataset['density']).toBe('default');
  });
});
