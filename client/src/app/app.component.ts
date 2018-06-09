import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {trigger, state, style, animate, transition, query} from '@angular/animations';
import {NameError, Project, ProjectService} from "./project.service";
import {File, FileService} from "./file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteParams} from "./app-routing.module";
import {MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {NewDialogComponent} from "./new-dialog/new-dialog.component";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {ProjectFile, ProjectFileService} from "./projectFile.service";
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
    private projectFileService: ProjectFileService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.filter((p:RouteParams) => exists(p.project, p.file)).mergeMap((params: RouteParams) => {
      this.selection = null;
      return Observable.combineLatest(
        this.projectService.getProjectByName(params.project).filter(p => exists(p)),
        this.fileService.getFileByName(params.file).filter(f => exists(f)))
    }).subscribe( v => {
      this.selection = {project: v[0], file: v[1]};
    });

    this.loadData();

    this.fabState$.delay(200).take(1).subscribe((v)=> {
      this.fabState$.next('in');
    });

    this.project$.subscribe(v => {
      console.log(v);
    });
  }

  get project$(): Observable<Project[]> {
    return Observable.combineLatest(this.projectService.projects$, this.fileService.file$,
        this.projectFileService.projectFile$).filter(v => exists(v[0], v[1], v[2])).map((v: Array<any>) => {
      let projects: Project[] = v[0];
      let files: File[] = v[1];
      let projFiles: ProjectFile[] = v[2];

      let projsHash: Map<string, Project> = new Map(projects.map(p => [p._key, p] as [string, Project]) );
      let filesHash: Map<string, File> = new Map(files.map(f => [f._key, f] as [string, File]));

      projFiles.forEach(pf => {
        let p: Project = projsHash.get(pf._from.replace(/^.*\//, ''));
        let f: File = filesHash.get(pf._to.replace(/^.*\//, ''));

        if (p && f) {
          if (!p.hasOwnProperty('files')) {
            p.files = [];
          }

          p.files.push(f);
        }
      });

      return Array.from(projsHash.values());
    }).shareReplay(1);
  }

  loadData() {
    this.projectService.fetch().take(1).subscribe();
    this.fileService.fetch().take(1).subscribe();
    this.projectFileService.fetch().take(1).subscribe();
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

    dialogRef.afterClosed().subscribe(name => {
      if (name != null && name != "") {
        let proj = this.projectService.createProject(name);
        this.projectService.save(proj).take(1)
          .subscribe(p=>{
            // this.router.navigate([p.name]);
          }, (e)=>{
            if (e.code == 409) {
              this.handleAddProject("A project with that name already exists");
            } else {
              throw e;
            }
          }
        );
      }
    });
  }

  handleRemoveProject(project: Project) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent , {
      data:{
        message: "Are you sure you want to remove the project "+project.name+"?"
      }
    });

    dialogRef.afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.router.navigateByUrl("");
        this.projectService.delete(project).subscribe(() => {
          this.loadData();
        });
      }
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

    dialogRef.afterClosed().subscribe(name => {
      if (name != null && name != "") {
        let f = this.fileService.createFile(name);
        this.fileService.save(f).take(1).subscribe(nf => {
          let pf = this.projectFileService.createProjectFile(project, nf);
          this.projectFileService.save(pf).take(1).subscribe();
        }, err => {
          if (err.code == 409) {
            this.handleAddFile(project, "A file with that name already exists");
          } else {
            throw err;
          }
        });
      }
    });
  }

  handleRemoveFile(sel: Selection) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent , {
      data:{
        message: "Are you sure you want to remove the file "+sel.file.name+"?"
      }
    });

    dialogRef.afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.fileService.delete(sel.file).subscribe(() => {
          this.loadData();
          // this.projectFileService.fetch().take(1).subscribe();
        });
      }
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
