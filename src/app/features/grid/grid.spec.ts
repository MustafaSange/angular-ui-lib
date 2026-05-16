import { TestBed } from '@angular/core/testing';

import { Grid } from './grid';

describe('Grid', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grid],
    }).compileComponents();
  });

  it('renders grid spans and responsive examples', () => {
    const fixture = TestBed.createComponent(Grid);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.col-1')).toHaveLength(12);
    expect(compiled.querySelector('.col-6')).toBeTruthy();
    expect(compiled.querySelector('.gt-xs-col-6')).toBeTruthy();
    expect(compiled.querySelector('.gt-sm-col-4')).toBeTruthy();
  });

  it('renders named containers', () => {
    const fixture = TestBed.createComponent(Grid);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.container-narrow')).toBeTruthy();
    expect(compiled.querySelector('.container-content')).toBeTruthy();
    expect(compiled.querySelector('.container-page')).toBeTruthy();
    expect(compiled.querySelector('.container-wide')).toBeTruthy();
    expect(compiled.querySelector('.container-full')).toBeTruthy();
  });
});
