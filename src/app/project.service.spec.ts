import { TestBed, inject } from '@angular/core/testing';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService]
    });
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

  it('should add projects', inject([ProjectService], (service: ProjectService) => {
    service.projects$.subscribe((ps) => {
      expect(ps.find((p) => p.name == 'projectName') != null).toBeTruthy();
    });
    service.addProjectByName('projectName');
  }));
});
