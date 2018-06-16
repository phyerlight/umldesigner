import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {trigger, state, style, animate, transition, query} from '@angular/animations';
import {NameError, Project, ProjectService} from "./project.service";
import {File, FileService} from "./file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteParams} from "./app-routing.module";
import {MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {NewDialogComponent} from "./new-dialog/new-dialog.component";
import { take, delay, filter, mergeMap, map, shareReplay, share } from "rxjs/operators";
import { combineLatest } from "rxjs/observable/combineLatest";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

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
export class AppComponent implements OnInit {
  title = 'UML Designer 4';

  private selection: Selection;
  protected fabState$ = new BehaviorSubject('out');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private fileService: FileService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.pipe(
      filter((p:RouteParams) => exists(p.project, p.file)),
      mergeMap((params: RouteParams) => {
        // this.selection = null;
        return this.projectService.projects$.pipe(
          map((ps: Project[]) => ps.find((p: Project) => p.name == params.project)),
          // filter((p: Project) => exists(p)),
          map((p: Project) => [p as Project, (p.files.find((f: File) => f.name == params.file)) as File] ),
          // filter(v => v.length == 2 && exists(v[1]))
        );
      })
    ).subscribe( v => {
      if (!exists(v[0], v[1])) {
        this.router.navigateByUrl("");
      }
      this.selection = {project: v[0] as Project, file: v[1] as File};
    });

    this.loadData();

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

  // get project$(): Observable<Project[]> {
  //   return combineLatest(
  //     this.projectService.projects$,
  //     this.fileService.file$,
  //     this.projectFileService.projectFile$)
  //     .pipe(
  //       filter(v => exists(v[0], v[1], v[2])),
  //       map((v: Array<any>) => {
  //         let projects: Project[] = v[0];
  //         let files: File[] = v[1];
  //         let projFiles: ProjectFile[] = v[2];
  //
  //         let projsHash: Map<string, Project> = new Map(projects.map(p => [p._key, p] as [string, Project]) );
  //         let filesHash: Map<string, File> = new Map(files.map(f => [f._key, f] as [string, File]));
  //
  //         projFiles.forEach(pf => {
  //           let p: Project = projsHash.get(pf._from.replace(/^.*\//, ''));
  //           let f: File = filesHash.get(pf._to.replace(/^.*\//, ''));
  //
  //           if (p && f) {
  //             if (!p.hasOwnProperty('files')) {
  //               p.files = [];
  //             }
  //
  //             p.files.push(f);
  //           }
  //         });
  //
  //         return Array.from(projsHash.values());
  //       }),
  //       share()
  //     );
  // }

  loadData() {
    this.projectService.getProjectList().pipe(take(1)).subscribe();
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
      mergeMap(name => this.projectService.save(ProjectService.createProject(name)))
    ).subscribe(p=>{
      this.loadData();
    }, (e)=>{
      if (e.code == 409) {
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
      mergeMap(name => this.fileService.save(FileService.createFile(name, project))),
    ).subscribe((newFile: File) => {
      //On successful saving, reload the data from the server
      this.loadData();
      //navigate to the new file
      this.router.navigate([project.name, newFile.name]);
    }, err => {
      if (err.code == 409) {
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
