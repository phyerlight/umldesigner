import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition } from '@angular/animations';
import {ProjectService} from "../../services/project.service";
import {createProject, Project} from "../../models/Project";
import {FileService} from "../../services/file.service";
import {createFile, File} from "../../../common/models";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteParams} from "../../app-routing.module";
import {MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {NewDialogComponent} from "../../components/new-dialog/new-dialog.component";
import { take, delay, filter, mergeMap, map } from "rxjs/operators";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Select, Store} from "@ngxs/store";
import {FileState} from "../../../common/state/file.state";
import {ProjectState} from "../../state/project.state";
import {combineLatest, Observable} from "rxjs";
import {LoadProjects} from "../../state/project.actions";

export type Selection = {
  project: Project,
  file: File
}

let exists = (...v) => v.every(v => v != null && v != undefined);

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
  protected fabState$ = new BehaviorSubject('out');
  protected file: File;

  @Select(ProjectState.projectList)
  protected projects$: Observable<Project[]>;

  @Select(FileState.fileByKey)
  protected fileByKey: (fileKey: string)=>File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected projectService: ProjectService,
    private fileService: FileService,
    protected store: Store,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.pipe(
      filter((p: RouteParams) => exists(p.project, p.file)),
      mergeMap((params: RouteParams) => {
        // this.selection = null;

        let project$ = this.projects$.pipe(map((ps: Project[]) => ps.find((p: Project) => p.name == params.project)));
        let file$ = this.store.select(ProjectState.projectFileByName).pipe(map(fn => fn(params.project, params.file)));

        return combineLatest(project$, file$);

        // return this.projects$.pipe(
        //   map((ps: Project[]) => ps.find((p: Project) => p.name == params.project)),
        //   // filter((p: Project) => exists(p)),
        //   map((p: Project) => {
        //     return [p as Project, (p.files.find((f: File) => f.name == params.file)) as File]
        //   }),
        //   // filter(v => v.length == 2 && exists(v[1]))
        // );
      })
    ).subscribe(([project, file]: [Project, File]) => {
      if (!exists(project, file)) {
        this.router.navigateByUrl("");
      }
      this.selection = {project, file};
      // this.store.select(FileState.fileByKey).pipe(map(fn => fn(file._key))).subscribe((f: File) => {
      //   this.file = f;
      // });
      this.file = this.fileByKey(file._key);
    });

    this.loadData();

  }

  ngAfterViewInit() {
    this.fabState$.pipe(
      delay(200),
      take(1)
    ).subscribe((v)=> {
      this.fabState$.next('in');
    });

    // this.project$.subscribe(v => {
    //   console.log(v);
    // });
  }

  loadData() {
    this.store.dispatch(new LoadProjects());
    // this.projectService.getProjectList().pipe(take(1)).subscribe();
    // this.fileService.getProjectList().pipe(take(1)).subscribe();
    // this.projectFileService.getProjectList().pipe(take(1)).subscribe();
  }

  handleSelection(selection: Selection) {
    if (selection != null) {
      this.router.navigate([selection.project.name, selection.file.name]);
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
      this.router.navigateByUrl("");
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
      this.router.navigate([project.name, newFile.name]);
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
        this.router.navigateByUrl("");
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