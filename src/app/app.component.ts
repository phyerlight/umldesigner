import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {trigger, state, style, animate, transition, query} from '@angular/animations';
import {File, NameError, Project, ProjectService} from "./project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteParams} from "./app-routing.module";
import {MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {NewDialogComponent} from "./new-dialog/new-dialog.component";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/delay';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export type Selection = {
  project: Project,
  file: File
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // animations: [
  //   trigger('fabState', [
  //     state('in', style({
  //       transform: 'scale(1)'
  //     })),
  //     state('out', style({
  //       transform: 'scale(0)'
  //     })),
  //     state('bottom', style({
  //       left: '0',
  //       bottom: '-10px',
  //       height: '40px',
  //       'border-radius': '0',
  //       width: '100%',
  //       position: 'relative',
  //       'align-self': 'flex-end',
  //     })),
  //     transition('out => in', animate('100ms ease-in')),
  //     transition('in => out', animate('100ms ease-out')),
  //     transition('in => bottom', animate('100ms ease-out')),
  //     transition('bottom => in', animate('100ms ease-out'))
  //   ])
  // ]
})
export class AppComponent implements OnInit {
  title = 'UML Designer 4';

  private selection: Selection;
  private doneBottom = false;
  protected fabState$ = new BehaviorSubject('out');

  @ViewChild('scrollContainer') scrollContainer: ElementRef;

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

    this.fabState$.delay(200).take(1).subscribe((v)=> {
      this.fabState$.next('in');
    });
  }

  handleSelection(selection: Selection) {
    if (selection != null) {
      this.router.navigate([selection.project.name, selection.file.name]);
    }
    this.checkScrollState();
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
      if (this.fabState$.getValue() != 'bottom') {
        this.fabState$.next('out');
      } else {
        sideNav.close();
      }
    } else {
      sideNav.open().then(value => {
        if (this.fabState$.getValue() != 'bottom') {
          this.fabState$.next('in');
        }
      });
    }
  }

  fabAnimationDone($event, sideNav: MatSidenav) {
    if ($event.fromState == 'void') return;

    if ($event.toState == 'bottom') {
      this.doneBottom = true;
    } else {
      this.doneBottom = false;
    }

    if ($event.toState == 'out') {
      sideNav.close();
    }
  }

  checkScrollState() {
    let el = this.scrollContainer.nativeElement;
    if (el.scrollHeight - el.scrollTop == el.clientHeight) {
      this.fabState$.next('bottom');
    } else {
      this.fabState$.next('in');
    }
    console.log(`clientHeight: ${el.clientHeight} ; scrollHeight: ${el.scrollHeight} ; scrollTop: ${el.scrollTop}`);
  }

  private oldHeight = null;
  watchScrollHeight() {
    let el = this.scrollContainer.nativeElement;
    if (this.oldHeight != el.scrollHeight) {
      this.oldHeight = el.scrollHeight;
      window.setTimeout(this.watchScrollHeight, 30);
    } else {
      this.checkScrollState();
      this.oldHeight = null;
    }
  }

  scrolledNav($event) {
    this.checkScrollState();
  }
}
