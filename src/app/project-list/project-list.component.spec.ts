import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListComponent } from './project-list.component';
import {FileType, Project, ProjectService} from "../project.service";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";

let projectServiceStub = {
  addProjectByName(name: string) {  }
};

let projects: Project[] = [
  {id: '1', name: 'p1', files: [
      {name: 'p1f1', type: FileType.Class, data: {}},
      {name: 'p1f2', type: FileType.Mock, data: {}},
    ]},
  {id: '2', name: 'p2', files: [
      {name: 'p2f1', type: FileType.Class, data: {}},
      {name: 'p2f2', type: FileType.Mock, data: {}},
      {name: 'p2f3', type: FileType.Class, data: {}}
    ]}
];

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectListComponent ],
      providers: [ {provide: ProjectService, useValue: projectServiceStub} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.query(By.css('.projects'));
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the project list', () => {
    component.projects = projects;
    fixture.detectChanges();

    let els = fixture.debugElement.queryAll(By.css('option'));
    expect(fixture.isStable()).toBeTruthy();
    expect(els.length).toBe(3);
    expect(els[0].nativeElement.textContent).toBe("Select a project...");
    expect(els[1].nativeElement.textContent).toBe("p1");
    expect(els[2].nativeElement.textContent).toBe("p2");
  });

  it("should emit a project on selection", () => {
    component.projects = projects;
    fixture.detectChanges();

    let select = fixture.debugElement.query(By.css('select'));
    expect(select.nativeElement.selectedIndex).toBe(0);

    let selectedProject: Project;
    component.onProjectSelected.subscribe((project) => {
      selectedProject = project;
    });
    select.nativeElement.selectedIndex = 2;
    select.triggerEventHandler('change', null);
    expect(selectedProject).toBe(projects[1]);
  });

  it("select the correct project on load if selected", () => {
    component.projects = projects;
    component.selectedProject = projects[0];
    fixture.detectChanges();

    let select = fixture.debugElement.query(By.css('select'));
    expect(select.nativeElement.selectedIndex).toBe(1);
  });
});
