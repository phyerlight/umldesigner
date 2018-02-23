import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {File, NameError, Project, ProjectService} from "./project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteParams} from "./app-routing.module";
import {ConfirmationService} from "primeng/api";

export type Selection = {
  project: Project,
  file: File
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'UML Designer 4';

  // private selectedProject: Project;
  // private selectedFile: File;
  private selection: Selection;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.route.params.subscribe((params: RouteParams) => {
      this.selection = null;

      if (params.project) {
        this.projectService.getProjectByName(params.project).subscribe(p=>{
          if (p != null) {
            if (params.file) {
              let file: File = p.files.find(v=> v.name == params.file);
              if (file) {
                this.selection = {project: p, file: file}
                return;
              }
            }
          }
          this.router.navigateByUrl("");
        });
      }
    });
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
  handleAddProject(msg: string = "") {
    if (msg == null || msg == "") msg = "What is the new project name?";
    let name = window.prompt(msg);
    //do not allow some characters that would be bad for URLs
    //if name is null, it means it was cancelled.
    while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
      name = window.prompt("The project name cannot be empty or contain the characters ' \" \\ / &");
    }

    if (name != null && name != "") {
      this.projectService.addProjectByName(name).subscribe(p=>{
        this.router.navigate([p.name]);
      }, e=>{
        if (e instanceof NameError) {
          this.handleAddProject(e.message);
        } else {
          throw e;
        }
      });

    }
  }

  handleRemoveProject(project: Project) {
    this.confirmationService.confirm({
      message: "Are you sure you want to remove the project "+project.name+"?",
      accept: () => {
        if (this.selection.project.id == project.id) {
          this.router.navigateByUrl("");
        }
        this.projectService.removeProject(project);
      }
    });
  }

  handleAddFile(project: Project, msg?: string) {
    if (msg == null || msg == "") msg = "What is the new drawing name?";
    let name = window.prompt(msg);
    while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
      name = window.prompt("The drawing name cannot be empty or contain the characters ' \" \\ / &");
    }

    if (name != null && name != "") {
      this.projectService.addFileByName(project, name).subscribe(f=> {
        this.router.navigate([project.name, f.name]);
      }, e=> {
        if (e instanceof NameError) {
          this.handleAddFile(project, e.message);
        } else {
          throw e;
        }
      });
    }
  }

  handleRemoveFile(sel: Selection) {
    this.confirmationService.confirm({
      message: "Are you sure you want to remove the file "+sel.file.name+"?",
      accept: () => {
        this.projectService.removeFile(sel.project, sel.file);
      }
    });
  }

  handleProjectAdded(p: Project) {

    this.router.navigate([p.name]);
  }

  handleFileAdded(p: Project, f: File) {
    this.router.navigate([p.name, f.name]);
  }

}
