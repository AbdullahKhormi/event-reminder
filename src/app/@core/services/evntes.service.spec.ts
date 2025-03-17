import { TestBed } from '@angular/core/testing';

import { EvntesService } from './evntes.service';

describe('EvntesService', () => {
  let service: EvntesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvntesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
