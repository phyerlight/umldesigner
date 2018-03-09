import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MatDialog, MatIconModule, MatSidenavModule, MatToolbarModule} from "@angular/material";
import {Component, Input} from "@angular/core";
import {RouteParams} from "./app-routing.module";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "./project.service";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
describe('AppComponent', () => {
  beforeEach(async(() => {
    let activatedRoute = {
      route: {
        params: {
          subscribe(next:(params: RouteParams)=>{}) {

          }
        }
      }
    };

    let router = {
      navigate: (commands: string[])=>{},
      navigateByUrl: (url: string)=>{}
    };

    let projectService = {

    };

    let matDialog = {

    };

    TestBed.configureTestingModule({
      imports: [
        MatIconModule, MatToolbarModule, MatSidenavModule,
        NoopAnimationsModule
      ],
      declarations: [
        AppComponent, AppDrawingListStub, AppEditorStub
      ],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: Router, useValue: router},
        {provide: ProjectService, useValue: projectService},
        {provide: MatDialog, useValue: matDialog}
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('UML Designer 4');
  }));
});

@Component({
  selector: 'app-drawing-list',
  template: ''
})
class AppDrawingListStub {
  @Input() projects;
  @Input() selection;
  constructor() { }
}

@Component({
  selector: 'app-editor',
  template: ''
})
class AppEditorStub {
  constructor() { }
}
