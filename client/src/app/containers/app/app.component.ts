import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition } from '@angular/animations';
import {ProjectService} from "../../services/project.service";
import {createProject, Project} from "../../models/Project";
import {FileService} from "../../services/file.service";
import {createFile, File} from "../../../common/models";
import {MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {NewDialogComponent} from "../../components/new-dialog/new-dialog.component";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Select, Store} from "@ngxs/store";
import {FileState} from "../../../common/state/file.state";
import {ProjectState} from "../../state/project.state";
import {Observable} from "rxjs";
import {take, delay, filter, mergeMap} from "rxjs/operators";
import {LoadProjectList} from "../../state/project.actions";
import {Navigate} from "@ngxs/router-plugin";

export type Selection = {
  project: Project,
  file: File
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fabState', [
      state('in', style({
        transform: 'scale(1)'
      })),
      state('out', style({
        transform: 'scale(0)'
      })),
      transition('out => in', animate('100ms ease-in')),
      transition('in => out', animate('100ms ease-out'))
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'UML Designer 4';

  protected selection: Selection;
  protected file: File;
  protected fabState$ = new BehaviorSubject('out');
  protected projects$: Observable<Project[]>;

  @Select(FileState.fileByKey)
  protected fileByKey: (fileKey: string)=>File;

  constructor(
    protected projectService: ProjectService,
    protected fileService: FileService,
    protected store: Store,
    protected dialog: MatDialog) {  }

  ngOnInit() {
    this.projects$ = this.store.select(ProjectState.projectList);
  }

  ngAfterViewInit() {
    this.fabState$.pipe(
      delay(200),
      take(1)
    ).subscribe((v)=> {
      this.fabState$.next('in');
    });
  }

  loadData() {
    return this.store.dispatch(new LoadProjectList());
  }

  handleSelection(selection: Selection) {
    if (selection != null) {
      this.store.dispatch(new Navigate([selection.project.name, selection.file.name]));
    }
  }

  /**
   * Handle adding a project to the system. If msg is not given or empty string, default starting the process of adding
   * a new project. Otherwise this can be used to handle errors as well.
   * @param {string} msg Initial message to display in the input box.
   */
  handleAddProject(msg: string = null) {
    let dialogRef = this.dialog.open(NewDialogComponent, {
      data: {
        type: 'project',
        message: msg
      },
      width: '400px'
    });

    dialogRef.afterClosed().pipe(
      filter(name => name != null && name != ""),
      mergeMap(name => this.projectService.save(createProject({name})))
    ).subscribe(p=>{
      this.loadData();
    }, (e)=>{
      if (e.status == 409) {
        this.handleAddProject("A project with that name already exists");
      } else {
        throw e;
      }
    });
  }

  handleRemoveProject(project: Project) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent , {
      data:{
        message: "Are you sure you want to remove the project "+project.name+"?"
      }
    });

    dialogRef.afterClosed().pipe(
      filter((accept: boolean) => accept),
      mergeMap(() => this.projectService.delete(project))
    ).subscribe(() => {
      this.store.dispatch(new Navigate(['']));
      this.loadData();
    });
  }

  handleAddFile(project: Project, msg: string=null) {
    let dialogRef = this.dialog.open(NewDialogComponent, {
      data: {
        type: 'file',
        message: msg
      },
      width: '400px'
    });

    dialogRef.afterClosed().pipe(
      //make sure we have a name that isn't blank
      filter(name => name != null && name != ""),
      //create and save the file to the server
      mergeMap((name:string) => this.fileService.save(createFile({name, project_key: project._key}))),
    ).subscribe((newFile: File) => {
      //On successful saving, reload the data from the server
      this.loadData();
      //navigate to the new file
      this.store.dispatch(new Navigate([project.name, newFile.name]));
    }, err => {
      if (err.status == 409) {
        this.handleAddFile(project, "A file with that name already exists");
      } else {
        throw err;
      }
    });
  }

  handleRemoveFile(sel: Selection) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent , {
      data:{
        message: "Are you sure you want to remove the file "+sel.file.name+"?"
      }
    });

    dialogRef.afterClosed().pipe(
      filter((accept: boolean) => accept),
      mergeMap(() => this.fileService.delete(sel.file))
    ).subscribe(() => {
      if (this.selection.project == sel.project && this.selection.file == sel.file) {
        this.store.dispatch(new Navigate(['']));
      }
      this.loadData();
    });
  }

  toggleSideNav(sideNav: MatSidenav) {
    if (sideNav.opened) {
      this.fabState$.next('out');
    } else {
      sideNav.open().then(value => {
        this.fabState$.next('in');
      });
    }
  }

  fabAnimationDone($event, sideNav: MatSidenav) {
    if ($event.fromState == 'void') return;

    if ($event.toState == 'out') {
      sideNav.close();
    }
  }
}
