import { TestBed } from '@angular/core/testing';

import { ProjectCountService } from './project-count.service';

describe('ProjectCountService', () => {
  let service: ProjectCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
