import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { PaperScope, Project } from 'paper';
import {Class, Relation} from "../project.service";
import Path = paper.Path;
import TextItem = paper.TextItem;
import PointText = paper.PointText;
import Group = paper.Group;
import Item = paper.Item;
import Point = paper.Point;
import {CanvasService} from "./canvas.service";

@Component({
  moduleId: module.id,
  styles: ['canvas {width: 100%; height: 100%}'],
  selector: 'paper-canvas',
  template: '<canvas #canvasElement resize></canvas>',
})

export class PaperCanvasComponent implements OnInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;

  @Input() name: string;

  scope: PaperScope;
  project: Project;

  constructor(private canvasService: CanvasService) { }

  ngOnInit() {
    this.scope = new PaperScope();
    this.scope.install(window['paper']);
    this.scope.settings['insertItems'] = false;
    this.scope.settings['applyMatrix'] = false;
    this.project = new Project(this.canvasElement.nativeElement);
    this.canvasService.registerCanvas(this, this.name);
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

    clasObj.position = new Point(clas.position.x, clas.position.y);

    this.project.activeLayer.addChild(clasObj);
  }

  public clearCanvas() {
    this.project.clear();
  }

  public drawRelation(rel: Relation) {

  }
}
