import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {NameError, Project, ProjectService} from "../project.service";
import {Input} from "@angular/core";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {

  @Input() selectedProject: Project;
  @Input() projects: Project[];

  @Output() onProjectSelected = new EventEmitter<Project>();
  @Output() onProjectAdded = new EventEmitter<Project>();

  constructor(private projectService: ProjectService) { }

  handleSelectProject(projectId) {
    this.onProjectSelected.emit(this.projects.find(v=>v.id == projectId));
  }

  /**
   * Handle adding a project to the system. If msg is not given or empty string, default starting the process of adding
   * a new project. Otherwise this can be used to handle errors as well.
   * @param {string} msg Initial message to display in the input box.
   */
  handleAddProject(msg: string = "") {
    if (msg == null || msg == "") msg = "What is the new projects$ name?";
    let name = window.prompt(msg);
    //do not allow some characters that would be bad for URLs
    //if name is null, it means it was cancelled.
    while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
      name = window.prompt("The projects$ name cannot be empty or contain the characters ' \" \\ / &");
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

}
