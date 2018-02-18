import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {File, Project, ProjectService} from "./project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteParams} from "./app-routing.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'UML Designer 4';

  private selectedProject: Project;
  private selectedFile: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService) { }

  ngOnInit() {
    this.route.params.subscribe((params: RouteParams) => {
      if (params.project) {
        this.projectService.getProjectByName(params.project).subscribe(p=>{
          if (p != null) {
            this.selectedProject = p;
            if (params.file) {
              let file: File = p.files.find(v=> v.name == params.file);
              // if (file) {
              this.selectedFile = file;
              // } else {
              if (!file) {
                this.router.navigate([this.selectedProject.name]);
              }
            }
          } else {
            this.router.navigateByUrl("");
            this.selectedProject = null;
          }
        });
      }
    });
  }

  handleProjectSelected(project: Project) {
    if (project == null) {
      this.router.navigateByUrl("");
    } else {
      this.router.navigate([project.name]);
    }
  }

  handleProjectAdded(p: Project) {
    this.router.navigate([p.name]);
  }

  handleFileAdded(f: File) {
    this.router.navigate([this.selectedProject.name, f.name]);
  }

  handleFileSelected(file: File) {
    if (file != null) {
      this.router.navigate([this.selectedProject.name, file.name]);
    } else {
      this.selectedFile = null;
    }
  }

}
