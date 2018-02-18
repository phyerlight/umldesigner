import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {File, FileType, NameError, Project, ProjectService} from "../project.service";

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileListComponent implements OnInit {

  @Input() selectedProject: Project;
  @Input() selectedFile: File;

  @Output() onFileSelected = new EventEmitter<File>();
  @Output() onFileAdded = new EventEmitter<File>();

  public fileTypes: FileType[] = FileType.getTypes();

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
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

  handleSelectFile(file: File) {
    this.onFileSelected.emit(file);
  }

}
