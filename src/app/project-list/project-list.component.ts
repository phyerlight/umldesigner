import { Component, OnInit } from '@angular/core';
import {Project, ProjectService} from "../project.service";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  public selectedProject: string;
  public projectList: Array<string>;
  public fileList: string[];

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) { }

  setProject($event) {
    this.router.navigate([$event.currentTarget.value]);
  }

  addProject() {
    let name = window.prompt("What is the new projects name?");
    if (name != null && name != "") {
      this.projectService.addProject(name);
      this.router.navigate([name]);
    }
  }

  addDrawing(drawingType: string) {
    let name = window.prompt("What is the new drawing name?");
    if (name != null && name != "") {
      this.projectService.addDrawing(this.selectedProject, name, drawingType);
      this.router.navigate([this.selectedProject, name]);
    }
  }

  selectFile(file: string) {
    this.router.navigate([this.selectedProject, file]);
  }

  ngOnInit() {
    this.route.url.subscribe((value: UrlSegment[]) => {
      let pid = null;
      this.projectList = this.projectService.getProjectNames();
      if (value.length > 0) {
        this.selectedProject = value[0].path;
        let p = this.projectService.getProjectByName(value[0].path);
        if (p != null) {
          this.fileList = p.files.map(v=>v.name);
        } else {
          this.router.navigateByUrl("");
        }
      }
    });
  }
}
