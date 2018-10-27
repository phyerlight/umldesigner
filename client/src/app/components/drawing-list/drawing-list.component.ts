import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Project} from "../../models/Project";
import {FileService} from "../../services/file.service";
import {File} from "../../../common/models/index";
import {Selection} from "../../containers/app/app.component";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/mergeMap';
import {Store} from "@ngxs/store";
import {ProjectState} from "../../state/project.state";

@Component({
  selector: 'app-drawing-list',
  templateUrl: './drawing-list.component.html',
  styleUrls: ['./drawing-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DrawingListComponent implements OnInit {

  // @Input() projects: Observable<Project[]>;
  @Input() projects: Project[];
  // private projects: Project[];

  private _firstSelection: boolean = true;
  private _selection: Selection;
  get selection(): Selection {
    return this._selection;
  }
  @Input('selection')
  set selection(sel: Selection) {
    //Do this hocus pocus to ensure the same objects are used to allow for ngModel to register the equality of the
    // selected file in the list box
    if (sel != null && this.projects) {
      let proj: Project = this.projects.find(value => value._key == sel.project._key);
      let file: File = sel.file; //proj.files.find(v => v.name == sel.file.name);
      this._selection = {project: proj, file: file};
      this.activeProject = proj;
      if (this._firstSelection) {
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
  // get activeProjectFiles(): File[] {
  //   if (this.activeProject) {
  //     return this.projectFiles.getProjectsByKey(this.activeProject._key).mergeMap((pfs: ProjectFile[]) => {
  //       return this.files.getFilesByKey(pfs.map(pf => pf._to.replace(/^.*\//, '')));
  //     });
  //   } else {
  //     return [];
  //   }
  // }

  // constructor(private projectFiles: ProjectFileService,private files: FileService) { }
  constructor(protected store: Store) { }

  ngOnInit() {
    // console.log(this.project$);
    // this.project$.subscribe((ps) => {
    //   this.projects = ps;
    // });
  }

  private genFileList(project: Project): Selection[] {
    // return this.projectFiles.getProjectsByKey(project._key).mergeMap((pfs: ProjectFile[]) => {
    //   return this.files.getFilesByKey(pfs.map(pf => pf._to.replace(/^.*\//, '')));
    // }).map(fs => {
    //   return fs.map(f => { return {project: project, file: f} });
    // });
    // return [];
    let list =this.store.selectSnapshot(ProjectState.projectFiles)(project).map(v => { return {project: project, file: v} });
    // console.log(list);
    return list;
  }

  handleSelection(selection: Selection) {
    this.onSelection.emit(selection);
  }

  isSelectedProject(project: Project) {
    if (this.activeProject == null) {
      return false;
    }
    return project._key == this.activeProject._key;
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
      if (this.activeProject == project) {
        this.activeProject = null;
      }
    }
  }
}
