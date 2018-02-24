import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {File, Project} from "../project.service";
import {Selection} from "../app.component";

@Component({
  selector: 'app-drawing-list',
  templateUrl: './drawing-list.component.html',
  styleUrls: ['./drawing-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrawingListComponent implements OnInit {

  @Input() projects: Project[];

  private _firstSelection: boolean = true;
  private _selection: Selection;
  get selection(): Selection {
    return this._selection;
  }
  @Input('selection')
  set selection(sel: Selection) {
    //Do this hocus pocus to ensure the same objects are used to allow for ngModel to register the equality of the
    // selected file in the list box
    if (sel != null) {
      let proj: Project = this.projects.find(value => value.id == sel.project.id);
      let file: File = proj.files.find(v => v.name == sel.file.name);
      this._selection = {project: proj, file: file};
      if (this._firstSelection) {
        this.activeProject = proj;
        this._firstSelection = false;
      }
    } else {
      this._selection = null;
    }
  }

  @Output() onSelection = new EventEmitter<Selection>();
  @Output() onProjectAdded = new EventEmitter();
  @Output() onProjectRemoved = new EventEmitter<Project>();
  @Output() onFileAdded = new EventEmitter<Project>();
  @Output() onFileRemoved = new EventEmitter<Selection>();

  activeProject: Project;

  constructor() { }

  ngOnInit() {

  }

  private genFileList(project: Project): Selection[] {
    return project.files.map(v => { return {project: project, file: v} });
  }

  handleSelection(selection: Selection) {
    this.onSelection.emit(selection);
  }

  isSelectedProject(project: Project) {
    if (this.activeProject == null) {
      return false;
    }
    return project.id == this.activeProject.id;
  }

  handleAddProject() {
    this.onProjectAdded.emit();

  }

  handleRemoveProject($event, project: Project) {
    $event.preventDefault();
    $event.cancelBubble = true;
    this.onProjectRemoved.emit(project);
  }

  handleAddFile() {
    this.onFileAdded.emit(this.activeProject);
  }

  handleRemoveFile($event, sel: Selection) {
    $event.cancelBubble = true;
    this.onFileRemoved.emit(sel);
  }

  selectActiveProject(project: Project, isOpened: boolean) {
    if (isOpened) {
      this.activeProject = project;
    } else {
      this.activeProject = null;
    }
  }

  // /**
  //  * Handle adding a project to the system. If msg is not given or empty string, default starting the process of adding
  //  * a new project. Otherwise this can be used to handle errors as well.
  //  * @param {string} msg Initial message to display in the input box.
  //  */
  // handleAddProject(msg: string = "") {
  //   if (msg == null || msg == "") msg = "What is the new project name?";
  //   let name = window.prompt(msg);
  //   //do not allow some characters that would be bad for URLs
  //   //if name is null, it means it was cancelled.
  //   while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
  //     name = window.prompt("The project name cannot be empty or contain the characters ' \" \\ / &");
  //   }
  //
  //   if (name != null && name != "") {
  //     this.projectService.addProjectByName(name).subscribe(p=>{
  //       this.onProjectAdded.emit(p);
  //     }, e=>{
  //       if (e instanceof NameError) {
  //         this.handleAddProject(e.message);
  //       } else {
  //         throw e;
  //       }
  //     });
  //
  //   }
  // }

  // handleAddFile(msg?: string) {
  //   if (msg == null || msg == "") msg = "What is the new drawing name?";
  //   let name = window.prompt(msg);
  //   while((name != null && !!name.match(/['"\\/&]/g)) || name == "") {
  //     name = window.prompt("The drawing name cannot be empty or contain the characters ' \" \\ / &");
  //   }
  //
  //   if (name != null && name != "") {
  //     this.projectService.addFileByName(this.activeProject, name).subscribe(f=> {
  //       this.onFileAdded.emit(f);
  //     }, e=> {
  //       if (e instanceof NameError) {
  //         this.handleAddFile(e.message);
  //       } else {
  //         throw e;
  //       }
  //     });
  //   }
  // }

}
