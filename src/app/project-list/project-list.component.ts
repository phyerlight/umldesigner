import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileType, NameError, Project, ProjectService} from "../project.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Input} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {

  @Input() selectedProject: Project;
  @Input() projects: Project[];

  @Output() onProjectSelected = new EventEmitter<Project>();
  @Output() onFileSelected = new EventEmitter<File>();
  @Output() onProjectAdded = new EventEmitter<Observable<Project>>();

  // public selectedProject: string;
  public fileTypes: FileType[] = FileType.getTypes();

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) { }

  handleSelectProject(projectId) {
    this.onProjectSelected.emit(this.projects.find(v=>v.id == projectId));
  }

  /**
   * Handle adding a project to the system. If msg is not given or empty string, default starting the process of adding
   * a new project. Otherwise this can be used to handle errors as well.
   * @param {string} msg Initial message to display in the input box.
   */
  handleAddProject(msg: string = "") {
    if (msg == null || msg == "") msg = "What is the new projects name?";
    let name = window.prompt(msg);
    //do not allow some characters that would be bad for URLs
    while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
      name = window.prompt("The projects name cannot be empty or contain the characters ' \" \\ / &");
    }

    if (name != null && name != "") {
      this.projectService.addProjectByName(name).subscribe(p=>{
        this.onProjectAdded.emit(p);
      }, e=>{
        if (e instanceof NameError) {
          this.handleAddProject(e.message);
        } else {
          throw e;
        }
      });

    }
  }

  handleAddDrawing(projectName: string, drawingTypeId: string) {
    let fileType = FileType.getTypeById(drawingTypeId);
    let name = window.prompt("What is the new "+fileType.name+" drawing name?");
    while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
      name = window.prompt("The "+fileType.name+" drawing name cannot be empty or contain the characters ' \" \\ / &");
    }
    if (name != null && name != "") {
      this.projectService.addDrawing(projectName, name, fileType);
      this.router.navigate([projectName, name]);
    }
  }

  handleSelectFile(projectName: string, file: string) {
    this.router.navigate([projectName, file]);
  }
}
