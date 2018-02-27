import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {File, NameError, Project, ProjectService} from "./project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteParams} from "./app-routing.module";
import {MatButton, MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {NewDialogComponent} from "./new-dialog/new-dialog.component";
import 'rxjs/add/operator/catch';

export type Selection = {
  project: Project,
  file: File
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
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

  @ViewChild(MatButton) fab: MatButton;

  protected fabState = 'out';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe((params: RouteParams) => {
      this.selection = null;

      if (params.project) {
        this.projectService.getProjectByName(params.project).subscribe(p=>{
          if (p != null) {
            if (params.file) {
              let file: File = p.files.find(v=> v.name == params.file);
              if (file) {
                this.selection = {project: p, file: file};
                return;
              }
            }
          }
          this.router.navigateByUrl("");
        });
      }
    });
    window.setTimeout(()=>{
      this.fabState = 'in';
    }, 200);
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
        this.projectService.addProjectByName(name)
          .subscribe(p=>{
            this.router.navigate([p.name]);
          }, (e)=>{
            if (e.name == 'NameError') {
              this.handleAddProject(e.message);
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
        this.projectService.removeProject(project);
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
        this.projectService.addFileByName(project, name).subscribe(f=> {
          this.router.navigate([project.name, f.name]);
        }, e=> {
          if (e.name == 'NameError') {
            this.handleAddFile(project, e.message);
          } else {
            throw e;
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
        this.projectService.removeFile(sel.project, sel.file);      }
    });
  }

  toggleSideNav(sideNav: MatSidenav) {
    if (sideNav.opened) {
      this.fabState = 'out';
    } else {
      sideNav.open().then(value => {
        this.fabState = 'in';
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
