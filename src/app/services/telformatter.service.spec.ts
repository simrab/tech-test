import { TestBed } from '@angular/core/testing';

import { TelformatterService } from './telformatter.service';

describe('TelformatterService', () => {
  let service: TelformatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelformatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
