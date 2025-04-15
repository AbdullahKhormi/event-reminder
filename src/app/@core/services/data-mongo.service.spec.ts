import { TestBed } from '@angular/core/testing';

import { DataMongoService } from './data-mongo.service';

describe('DataMongoService', () => {
  let service: DataMongoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataMongoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
