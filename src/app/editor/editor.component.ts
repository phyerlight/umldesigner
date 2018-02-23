import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ProjectService, File} from "../project.service";
import {RouteParams} from "../app-routing.module";

export class DrawingTool {
  constructor(
    public name: string,
    public icon: string,
    public toolTip: string,
    public action: ()=>{}
  ) {}
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public file: File;
  public tools: DrawingTool;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.route.params.subscribe((params: RouteParams) => {
      if (params.project && params.file) {
        this.projectService.getFile(params.project, params.file).subscribe(f=>{
          this.file = f;
        }, e => {

        })
      }
    });
  }
}
