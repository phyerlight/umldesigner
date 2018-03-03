import { TestBed, inject } from '@angular/core/testing';

import { ProjectService } from './project.service';
import {ModelFactory} from "ngx-model";

describe('ProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService, ModelFactory]
    });
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

  it('should add projects', inject([ProjectService], (service: ProjectService) => {
    service.projects$.take(1).subscribe((ps) => {
      expect(ps.find((p) => p.name == 'projectName') != null).toBeFalsy();
    });
    service.addProjectByName('projectName');
    service.projects$.take(1).subscribe((ps) => {
      expect(ps.find((p) => p.name == 'projectName') != null).toBeTruthy();
    });
    service.addProjectByName('projectName').subscribe(() => {
      expect(true).toBeFalsy("Should have thrown an error on adding a project with the same name.")
    }, (err) => {
      expect(err.message).toMatch(/Name .* is already in use/);
    });
  }));

  it('should get project by name', inject([ProjectService], (service: ProjectService) => {
    service.getProjectByName('projectName').subscribe((p) => {
      expect(p).toBeFalsy();
    });
    service.addProjectByName('projectName');
    service.getProjectByName('projectName').subscribe((p) => {
      expect(p.name).toEqual('projectName');
    });
  }));

  it('should remove projects', inject([ProjectService], (service: ProjectService) => {
    service.addProjectByName('project').subscribe((p) => {
      service.getProjectByName('project').subscribe((p) => {
        expect(p.name).toEqual('project');
      });
      service.removeProject(p).subscribe((removed) => {
        expect(removed).toBeTruthy();
      });
      service.removeProject(p).subscribe(() => {
        expect(false).toBe(true, "Error did not get caught.");
      }, (err) => {
        expect(err.message).toContain('Could not find project');
      });
    });
  }));

  it('should add files to a project', inject([ProjectService], (service: ProjectService) => {
    service.addProjectByName('project').subscribe((p) => {
      service.addFileByName(p, 'file1').subscribe((f) => {
        expect(f.name).toEqual('file1');
      });
      service.addFileByName(p, 'file1').subscribe(() => {
        expect(false).toBeTruthy("Should have caught an error");
      }, (err) => {
        expect(err.message).toMatch(/Name .* is already in use/);
      });
    });
    service.addFileByName({id: '1000', name: 'project2', files:[]}, 'filex').subscribe(() => {
      expect(false).toBeTruthy("Should have caught error. Adding file to non-existent project");
    }, err => {
      expect(err.message).toMatch(/Could not find project/);
    });
  }));

  it('should get a file from a project', inject([ProjectService], (service: ProjectService) => {
    service.addProjectByName('project').subscribe((p) => {
      service.addFileByName(p, 'file1');
      service.addFileByName(p, 'file2');
    });
    service.getFile('project', 'file2').subscribe(f => {
      expect(f.name).toEqual('file2');
    });
    service.getFile('project', 'file3').subscribe(() => {
      expect(false).toBeTruthy("Should have caught an error. File not found");
    }, err => {
      expect(err.message).toMatch(/Could not find file/);
    });
    service.getFile('project1', 'file1').subscribe(() => {
      expect(false).toBeTruthy("Should have caught an error. Project not found.");
    }, err => {
      expect(err.message).toMatch(/Could not find project/);
    });
  }));

  it('should remove a file from a project', inject([ProjectService], (service: ProjectService) => {
    let project = null;
    service.addProjectByName('project').subscribe((p) => {
      project = p;
      service.addFileByName(p, 'file1');
      service.addFileByName(p, 'file2');
    });
    service.getFile('project', 'file1').subscribe(f => {
      service.removeFile(project, f).subscribe(removed => {
        expect(removed).toBeTruthy();
      });
      service.removeFile(project, f).subscribe(() => {
        expect(true).toBeFalsy("should have caught error removing a file that's been removed.");
      }, err => {
        expect(err.message).toMatch(/Could not find file/);
      })
    });
    service.getFile('project', 'file1').subscribe(() => {
      expect(true).toBeFalsy("should have caught error getting a file that's been removed.");
    }, err => {
      expect(err.message).toMatch(/Could not find file/);
    });

    service.removeFile({id: '1000', name:'badproject', files:[]}, {name: 'file1', data:{}}).subscribe(()=>{
      expect(true).toBeFalsy("should have caught error. missing project");
    }, err => {
      expect(err.message).toMatch(/Could not find project/);
    })
  }));

});
