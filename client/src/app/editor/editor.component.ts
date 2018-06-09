import {Component, Input, OnInit} from '@angular/core';
import {ProjectService} from "../project.service";
import {File, Class, Relation} from "../file.service";
import {PaperCanvasComponent} from "./paperCanvas.component";
import Path = paper.Path;
import Point = paper.Point;
import Color = paper.Color;
import {PaperScope, Project} from "paper";
import {DrawingTool, ToolService} from "./tools.service";
import {CanvasService} from "./canvas.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/combineLatest';
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import PointText = paper.PointText;
import Group = paper.Group;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [ToolService, CanvasService]
})
export class EditorComponent implements OnInit {

  private file$: BehaviorSubject<File>;
  @Input()
  set file(file: File) {
    if (!this.file$) {
      this.file$ = new BehaviorSubject<File>(file);
    } else {
      this.file$.next(file);
    }
  }

  private canvas: PaperCanvasComponent;

  public tools: DrawingTool[];
  private canvasName = 'main';

  constructor(public toolService: ToolService,
              public canvasService: CanvasService) { }

  ngOnInit() {
    this.tools = this.toolService.getTools();
    this.canvasService.getCanvas(this.canvasName).combineLatest(this.file$).subscribe((v: [PaperCanvasComponent, File]) => {
      this.canvas = v[0];

      this.renderDrawing(v[1]);
    });

  }

  get activeTool() {
    return this.canvas.scope.tool;
  }

  activateTool(tool: DrawingTool) {
    tool.activate();
  }

  renderDrawing(file: File) {
    this.canvas.clearCanvas();

    //if we have data
    if (file && file.data && file.data.classes) {
      //draw the classes
      file.data.classes.forEach((clas) => {
        this.drawClass(clas);
      });
      //if we have relations, draw those too
      if (file.data.relations) {
        file.data.relations.forEach((rel) => {
          this.drawRelation(rel);
        });
      }
    }
  }

  public drawClass(clas: Class) {
    let linePadding = 4;
    let widthPadding = 4;
    let boxWidth = 0;
    let boxHeight = 0;

    let sectionText:PointText[] = [];
    clas.attrs.join("\n").split('--').forEach((sect, index, array) => {
      let s = new PointText({
        content: sect.trim(),
        fillColor: 'black'
      });

      if (index == 0) {
        boxHeight += linePadding;
      }

      s.pivot = s.bounds.topLeft;
      s.position = new Point(0, boxHeight);
      boxWidth = s.bounds.width > boxWidth ? s.bounds.width : boxWidth;
      boxHeight = boxHeight + s.bounds.height;

      if (index < array.length-1) {
        boxHeight += linePadding;
      }

      sectionText.push(s);
    });

    let name = new PointText({
      content: clas.name,
      fillColor: 'black',
      fontWeight: 'bold'
    });
    boxHeight += name.bounds.height + linePadding*2;
    if (name.bounds.width > boxWidth) {
      name.pivot = name.bounds.bottomLeft;
      name.position = new Point(0,0);
      boxWidth = name.bounds.width;
    } else {
      name.pivot = name.bounds.bottomCenter;
      name.position = new Point(boxWidth/2, -1*widthPadding/2);
    }

    let clasBox = new Path.Rectangle({
      size: [boxWidth+widthPadding*2, boxHeight],
      strokeColor: 'black',
      name: 'selector'
    });
    clasBox.pivot = clasBox.bounds.topLeft;
    clasBox.position = new Point(-1*widthPadding, -1*name.bounds.height-widthPadding);

    let clasObj = new Group();

    clasObj.addChild(name);
    clasObj.addChild(new Path.Line({strokeColor: 'black',
      from: [clasBox.bounds.left, name.bounds.bottom+linePadding/2], to: [clasBox.bounds.right, name.bounds.bottom+linePadding/2]}));
    sectionText.forEach((s, index, array)=>{
      clasObj.addChild(s);

      if (index < array.length-1) {
        clasObj.addChild(new Path.Line({strokeColor: 'black',
          from: [clasBox.bounds.left, s.bounds.bottom+linePadding/2], to: [clasBox.bounds.right, s.bounds.bottom+linePadding/2]}));
      }
    });
    clasObj.addChild(clasBox);
    clasObj.data = {type: 'class'};

    clasObj.position = new Point(clas.position.x, clas.position.y);

    this.canvas.project.activeLayer.addChild(clasObj);
  }

  public drawRelation(rel: Relation) {

  }

}
