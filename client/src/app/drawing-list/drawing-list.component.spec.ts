import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingListComponent } from './drawing-list.component';
import {
  MatExpansionModule, MatExpansionPanelHeader, MatIconModule, MatListItem, MatListModule,
  MatNavList
} from "@angular/material";
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLink, Routes} from "@angular/router";
import {Component} from "@angular/core";
import {Project} from "../project.service";
import {By} from "@angular/platform-browser";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

let projects: Project[] = [
  {id: '1', name: 'test1', files:[
      {name: 't1f1', data: {}},
      {name: 't1f2', data: {}}
  ]},
  {id: '2', name: 'test2', files:[
      {name: 't2f1', data: {}},
      {name: 't2f2', data: {}}
  ]}
];

declare var spyOn: any;

describe('DrawingListComponentUserInterface', () => {
  let component: DrawingListComponent;
  let fixture: ComponentFixture<DrawingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule, MatIconModule, MatListModule,
        RouterTestingModule.withRoutes(routes),
        NoopAnimationsModule
      ],
      declarations: [
        DrawingListComponent, AppComponentStub
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display project names in list', () => {
    component.projects = projects;
    fixture.detectChanges();

    let epanels = fixture.debugElement.queryAll(By.directive(MatExpansionPanelHeader));
    expect(epanels.length).toBe(2);
    expect(epanels[0].nativeElement.textContent).toContain(projects[0].name);
    expect(epanels[1].nativeElement.textContent).toContain(projects[1].name);
  });

  it('should select active project on panel expansion', () => {
    component.projects = projects;
    let spy = spyOn(component, 'selectActiveProject').and.callThrough();
    fixture.detectChanges();

    let epanels = fixture.debugElement.queryAll(By.directive(MatExpansionPanelHeader));
    epanels[0].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(spy.calls.count()).toBe(1);
    expect(epanels[0].classes['mat-expanded']).toBeTruthy("selected project panel did not expand");
    expect(component.isSelectedProject(projects[0])).toBeTruthy("isSelectedProject not returning true");
  });

  it('should deselect active project on panel contraction', () => {
    component.projects = projects;
    fixture.detectChanges();

    let epanels = fixture.debugElement.queryAll(By.directive(MatExpansionPanelHeader));
    epanels[0].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(epanels[0].classes['mat-expanded']).toBeTruthy("selected project panel did not expand");
    expect(component.isSelectedProject(projects[0])).toBeTruthy("isSelectedProject not returning true");

    epanels[0].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(epanels[0].classes['mat-expanded']).toBeFalsy("selected project panel did not contract");
    expect(component.activeProject).toBeFalsy("activeProject is still selected");
  });

  it('should select new active project on selecting a different project panel', () => {
    component.projects = projects;
    fixture.detectChanges();

    let epanels = fixture.debugElement.queryAll(By.directive(MatExpansionPanelHeader));
    epanels[0].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(epanels[0].classes['mat-expanded']).toBeTruthy("selected project panel did not expand");
    expect(component.isSelectedProject(projects[0])).toBeTruthy("isSelectedProject not returning true");

    epanels[1].triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(epanels[0].classes['mat-expanded']).toBeFalsy("old selected project panel did not contract");
    expect(epanels[1].classes['mat-expanded']).toBeTruthy("new selected project panel did not expand");
    expect(component.activeProject).toBe(projects[1]);
  });

  it('should expand project when receiving selection', () => {
    component.projects = projects;
    fixture.detectChanges();

    let epanels = fixture.debugElement.queryAll(By.directive(MatExpansionPanelHeader));

    component.selection = {project: projects[1], file: projects[1].files[0]};
    fixture.detectChanges();

    expect(epanels[1].classes['mat-expanded']).toBeTruthy("selected project panel did not expand");
    expect(component.isSelectedProject(projects[1])).toBeTruthy("isSelectedProject not returning true");

    component.selection = {project: projects[0], file: projects[0].files[0]};
    fixture.detectChanges();

    expect(epanels[1].classes['mat-expanded']).toBeFalsy("old selected project panel did not contract");
    expect(epanels[0].classes['mat-expanded']).toBeTruthy("new selected project panel did not expand");
    expect(component.activeProject).toBe(projects[0]);
  });

  it('should display file names in list of expanded project panel', () => {
    component.projects = projects;
    fixture.detectChanges();

    component.selection = {project: projects[1], file: projects[1].files[0]};
    fixture.detectChanges();

    let fList = fixture.debugElement.queryAll(By.directive(MatNavList));
    expect(fList.length).toBe(2);
    let listItems = fList[0].queryAll(By.directive(MatListItem));
    expect(listItems.length).toBe(2);
    expect(listItems[0].nativeElement.textContent).toContain(projects[0].files[0].name);
    expect(listItems[1].nativeElement.textContent).toContain(projects[0].files[1].name);
  });

  it('should link list items to a routerLink', () => {
    component.projects = projects;
    fixture.detectChanges();

    component.selection = {project: projects[1], file: projects[1].files[0]};
    fixture.detectChanges();

    let fList = fixture.debugElement.queryAll(By.directive(MatNavList));
    expect(fList.length).toBe(2);
    let listItems = fList[0].queryAll(By.directive(MatListItem));

    let link = listItems[0].query(By.css('a'));
    expect(link).toBeTruthy("Link was not found in list item");
    expect(link.nativeElement.href).toContain('/test1/t1f1');
  });

});

describe('DrawingListComponentInterface', () => {
  let component: DrawingListComponent;
  let fixture: ComponentFixture<DrawingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule, MatIconModule, MatListModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        DrawingListComponent, AppComponentStub
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

@Component({
  selector: 'app-root',
  template: '<h1>UML Designer</h1>'
})
class AppComponentStub {
  constructor() { }
}

const routes: Routes = [
  { path: '', component: AppComponentStub},
  { path: ':project/:file', component: AppComponentStub}
];
