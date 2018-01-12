import {Component, OnInit} from '@angular/core';
import {FileType, Project, ProjectService} from "./project.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'UML Designer 4';

  private selectedProject: Project;
  private projects: Observable<Project[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService) { }

  private handleProjectSelected(project: Project) {
    // this.selectedProject = project;
    this.router.navigate([project.name]);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.project) {
        let p = this.projectService.getProjectByName(params.project);
        if (p != null) {
          this.selectedProject = p;
        } else {
          this.router.navigateByUrl("");
        }
      }
    });

    this.projects = this.projectService.projects;
  }

  handleProjectAdded(p: Project) {
    this.router.navigate([p.name]);
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
