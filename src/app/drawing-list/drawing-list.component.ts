import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {File, FileType, NameError, Project, ProjectService} from "../project.service";

@Component({
  selector: 'app-drawing-list',
  templateUrl: './drawing-list.component.html',
  styleUrls: ['./drawing-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrawingListComponent implements OnInit {

  @Input() projects: Project[];

  @Input() selectedProject: Project;
  @Input() selectedFile: File;

  @Output() onProjectSelected = new EventEmitter<Project>();
  @Output() onProjectAdded = new EventEmitter<Project>();

  @Output() onFileSelected = new EventEmitter<File>();
  @Output() onFileAdded = new EventEmitter<File>();

  constructor(private projectService: ProjectService) { }

  ngOnInit() {

  }

  handleSelectProject($event, isOpened: boolean) {
    if (isOpened) {
      this.onProjectSelected.emit(this.projects[$event.index]);
    } else {
      this.onProjectSelected.emit(null);
      this.onFileSelected.emit(null);
    }
  }

  handleSelectFile(file: File) {
    this.onFileSelected.emit(file);
  }

  isSelectedProject(project: Project) {
    if (!project || !this.selectedProject) {
      return false;
    }
    return project.id == this.selectedProject.id;
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

  handleRemoveProject(project: Project) {

  }

  handleAddFile(fileType: FileType, msg?: string) {
    // let fileType = FileType.getTypeById(drawingTypeId);
    if (msg == null || msg == "") msg = "What is the new "+fileType.name+" drawing name?";
    let name = window.prompt(msg);
    while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
      name = window.prompt("The "+fileType.name+" drawing name cannot be empty or contain the characters ' \" \\ / &");
    }

    if (name != null && name != "") {
      this.projectService.addFileByName(this.selectedProject, name, fileType).subscribe(f=> {
        this.onFileAdded.emit(f);
      }, e=> {
        if (e instanceof NameError) {
          this.handleAddFile(fileType, e.message);
        } else {
          throw e;
        }
      });
    }
  }

}
