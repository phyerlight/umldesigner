import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../project.service";
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  protected projectList: object;
  public selectedProject: string;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,
              private router: Router) { }

  public getProjects(): Array<string> {
    return Object.keys(this.projectList);
  }

  public selectFile(file) {
    this.router.navigate([this.selectedProject, file]);
  }

  public getFiles(): Array<string> {
    if (this.selectedProject != null && this.selectedProject != "" &&
        this.projectList.hasOwnProperty(this.selectedProject)) {
      return this.projectList[this.selectedProject];
    }
  }

  setProject($event) {
    this.router.navigate([$event.currentTarget.value]);
  }

  addProject() {
    
  }

  addDrawing(drawingType: string) {

  }

  ngOnInit() {
    this.projectList = this.projectService.getProjects();

    this.route.url.subscribe((value: UrlSegment[]) => {
      if (value.length > 0) {
        this.selectedProject = value[0].path;
      }
    });
  }

}
