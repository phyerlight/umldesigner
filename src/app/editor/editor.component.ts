import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ProjectService, File} from "../project.service";
import {RouteParams} from "../app-routing.module";
import {PaperCanvasComponent} from "./paperCanvas.component";
import Path = paper.Path;
import Point = paper.Point;
import Color = paper.Color;

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
export class EditorComponent implements OnInit, AfterViewInit {

  @Input() public file: File;

  @ViewChild(PaperCanvasComponent) canvas: PaperCanvasComponent;

  public tools: DrawingTool;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute, ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.canvas.scope.install(window['paper']);
    let circle = new Path.Circle({
      center: [100, 100],
      radius: 30,
      strokeColor: 'red'
    });
    this.canvas.project.activeLayer.addChild(circle);
  }
}
